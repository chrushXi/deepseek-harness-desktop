/**
 * Close an interrupted session: truncate the log at the last dangling
 * tool/call (dropping crash-recovery residue and failed resume turns that were
 * stacked on top), then append the harness's OWN synthetic closers
 * (interruptedTurnClosers) so the stored transcript is provider-valid and the
 * next resume works without relying on the coordinator's commit timing.
 *
 * Usage: node close-turn.mjs <input.jsonl.zstd> <output.jsonl.zstd>
 */
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { zstdDecompressSync, zstdCompressSync, constants } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire("D:\\DeepSeek Harness\\resources\\runtime\\node_modules\\@deepseek-ai\\dsh-session\\package.json");
const { decodeStorageRecord, interruptedTurnClosers } = require("@deepseek-ai/dsh-session");

const ZSTD_MAGIC = 4247762216;
const CHECKSUM_OPTIONS = { params: { [constants.ZSTD_c_checksumFlag]: 1 } };

function scanZstdFrames(buffer) {
  const frames = [];
  let offset = 0;
  let tornStart;
  outer: while (offset < buffer.length) {
    const start = offset;
    if (buffer.length - offset < 4) { if (tornStart === undefined) tornStart = start; break; }
    if (buffer.readUInt32LE(offset) !== ZSTD_MAGIC) throw new Error(`invalid frame magic at byte ${offset}`);
    offset += 4;
    if (offset === buffer.length) { if (tornStart === undefined) tornStart = start; break; }
    const descriptor = buffer.readUInt8(offset); offset += 1;
    if ((descriptor & 24) !== 0) throw new Error(`reserved frame-header bit at byte ${offset - 1}`);
    const contentSizeFlag = descriptor >>> 6;
    const singleSegment = (descriptor & 32) !== 0;
    const checksum = (descriptor & 4) !== 0;
    const dictionaryFlag = descriptor & 3;
    const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag;
    const contentSizeBytes = contentSizeFlag === 0 ? (singleSegment ? 1 : 0) : (1 << contentSizeFlag);
    const remainingHeaderBytes = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes;
    if (buffer.length - offset < remainingHeaderBytes) { if (tornStart === undefined) tornStart = start; break; }
    offset += remainingHeaderBytes;
    for (;;) {
      if (buffer.length - offset < 3) { if (tornStart === undefined) tornStart = start; break outer; }
      const blockHeader = buffer.readUIntLE(offset, 3);
      offset += 3;
      const lastBlock = (blockHeader & 1) !== 0;
      const blockType = (blockHeader >>> 1) & 3;
      const blockSize = blockHeader >>> 3;
      if (blockType === 3) throw new Error(`reserved block type at byte ${offset - 3}`);
      const payloadBytes = blockType === 1 ? 1 : blockSize;
      if (buffer.length - offset < payloadBytes) { if (tornStart === undefined) tornStart = start; break outer; }
      offset += payloadBytes;
      if (lastBlock) break;
    }
    if (checksum) { if (buffer.length - offset < 4) { if (tornStart === undefined) tornStart = start; break; } offset += 4; }
    frames.push({ start, end: offset });
  }
  return { frames, tornStart };
}

function decodeAll(path) {
  const buffer = readFileSync(path);
  const { frames, tornStart } = scanZstdFrames(buffer);
  if (tornStart !== undefined) throw new Error(`input has a torn final frame at byte ${tornStart}; refusing`);
  const parts = [];
  for (const f of frames) parts.push(zstdDecompressSync(buffer.subarray(f.start, f.end)));
  return { plain: Buffer.concat(parts), buffer };
}

const RESIDUE_TYPES = new Set([
  "session/end-seed", "agent/inbox/spliced", "turn/start", "step/start",
  "user/message", "request/header", "assistant/chunk", "step/end", "turn/end",
]);

function run(inputPath, outputPath) {
  const { plain } = decodeAll(inputPath);
  const headerEnd = plain.indexOf(10);
  const headerLine = plain.subarray(0, headerEnd).toString("utf8");
  const header = JSON.parse(headerLine);
  if (header.type !== "session") throw new Error("first line is not a session header");

  // Split into records.
  const records = [];
  {
    let start = headerEnd + 1;
    let i = start;
    let lineNo = 0;
    while (i <= plain.length) {
      const nl = i === plain.length ? -1 : plain.indexOf(10, i);
      if (nl === -1) break;
      lineNo++;
      records.push({ lineNo, start, end: nl, text: plain.subarray(start, nl) });
      i = nl + 1; start = i;
    }
  }

  // Decode events per record.
  const eventLines = []; // per event: { event, recIndex }
  for (let ri = 0; ri < records.length; ri++) {
    const rec = records[ri];
    let decoded;
    try { decoded = decodeStorageRecord(JSON.parse(rec.text.toString("utf8"))); }
    catch (e) { throw new Error(`unparsable record at line ${rec.lineNo}: ${e.message}`); }
    for (const event of decoded) eventLines.push({ event, recIndex: ri });
  }

  // Find dangling tool calls (tool/call with no following tool/result for its callId).
  const callIds = new Map();
  const results = new Set();
  for (const { event } of eventLines) {
    if (event.type === "tool/call") callIds.set(event.data.callId, event);
    else if (event.type === "tool/result") {
      const cid = event.data?.message?.source?.callId;
      if (cid) results.add(cid);
    }
  }
  const dangling = [...callIds.entries()].filter(([cid]) => !results.has(cid));
  console.log(`events=${eventLines.length} tool/calls=${callIds.size} results=${results.size} dangling=${dangling.length}`);
  if (dangling.length !== 1) throw new Error(`expected exactly 1 dangling tool call, found ${dangling.length}; refusing`);
  const [danglingCid, danglingEvent] = dangling[0];
  const truncateAtEvent = danglingEvent.seq;
  console.log(`dangling call: ${danglingCid} seq=${danglingEvent.seq} name=${danglingEvent.data.name} turn=${danglingEvent.data.turn} step=${danglingEvent.data.step}`);

  // Guard: everything after the dangling call must be crash-recovery residue.
  const after = eventLines.filter(({ event }) => event.seq > truncateAtEvent);
  for (const { event } of after) {
    if (!RESIDUE_TYPES.has(event.type)) {
      throw new Error(`unexpected event type "${event.type}" (seq ${event.seq}) after the dangling call; refusing`);
    }
  }
  console.log(`dropping ${after.length} residue events after seq ${truncateAtEvent}`);

  // Kept events: seq 0..truncateAtEvent, and the records they live in.
  const kept = eventLines.filter(({ event }) => event.seq <= truncateAtEvent);
  const keptEventCount = kept.length;
  const lastSeq = kept[kept.length - 1].event.seq;
  const firstResidueRec = after.length > 0 ? after[0].recIndex : records.length;
  const keptRecordTexts = records.slice(0, firstResidueRec).map((r) => r.text);

  // Synthetic closers generated by the harness's own repair function.
  const closers = interruptedTurnClosers(kept.map(({ event }) => event));
  console.log(`closers generated: ${closers.length}`);
  for (const c of closers) console.log(`  ${c.type} seq=${c.seq} turn=${c.data.turn}${c.data.step !== void 0 ? ` step=${c.data.step}` : ""} time=${c.time}`);
  if (closers.length === 0) throw new Error("interruptedTurnClosers returned nothing; log does not end in an open turn");

  // Build the new plaintext: header line + kept record lines + closer lines.
  const lines = [Buffer.from(headerLine + "\n", "utf8")];
  for (const text of keptRecordTexts) lines.push(Buffer.concat([Buffer.from(text), Buffer.from("\n", "utf8")]));
  for (const closer of closers) lines.push(Buffer.from(JSON.stringify(closer) + "\n", "utf8"));

  // Re-encode frames: header frame, then grouped lines.
  const frames = [zstdCompressSync(lines[0], CHECKSUM_OPTIONS)];
  const GROUP = 64;
  const rest = lines.slice(1);
  for (let i = 0; i < rest.length; i += GROUP) {
    const group = rest.slice(i, i + GROUP);
    frames.push(zstdCompressSync(Buffer.concat(group), CHECKSUM_OPTIONS));
  }
  const out = Buffer.concat(frames);

  const tmp = `${outputPath}.${Date.now().toString(36)}.close.tmp`;
  writeFileSync(tmp, out);
  try { renameSync(tmp, outputPath); }
  catch (e) { throw new Error(`rename failed: ${e.message}`); }

  console.log(JSON.stringify({
    headerId: header.id,
    keptEvents: keptEventCount,
    lastKeptSeq: lastSeq,
    droppedResidueEvents: after.length,
    closers,
    outputBytes: out.length,
    outputPath,
  }, null, 2));
  return { keptEventCount, closers };
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !outputPath || !existsSync(inputPath)) {
  console.error("usage: node close-turn.mjs <input.jsonl.zstd> <output.jsonl.zstd>");
  process.exit(2);
}
run(inputPath, outputPath);
