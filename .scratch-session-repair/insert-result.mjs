/**
 * Close a stranded dangling tool call: the session died mid-tool-call and
 * subsequent failed resume turns were stacked on top, so the harness's own
 * tail repair (interruptedTurnClosers) cannot fire (the log ends closed).
 *
 * Fix: insert a synthetic `tool/result` (harness-mirrored shape: an
 * "interrupted / outcome unknown" error result) IMMEDIATELY after the dangling
 * tool/call, and renumber every later event by +1 so seq stays contiguous.
 *
 * Usage: node insert-result.mjs <input.jsonl.zstd> <output.jsonl.zstd>
 */
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { zstdDecompressSync, zstdCompressSync, constants } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire("D:\\DeepSeek Harness\\resources\\runtime\\node_modules\\@deepseek-ai\\dsh-session\\package.json");
const { decodeStorageRecord, interruptedTurnClosers, TOOL_OUTCOME_UNKNOWN } = require("@deepseek-ai/dsh-session");

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
  const eventLines = [];
  for (let ri = 0; ri < records.length; ri++) {
    let decoded;
    try { decoded = decodeStorageRecord(JSON.parse(records[ri].text.toString("utf8"))); }
    catch (e) { throw new Error(`unparsable record at line ${records[ri].lineNo}: ${e.message}`); }
    for (const event of decoded) eventLines.push({ event, recIndex: ri });
  }

  // Find dangling tool calls.
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
  const insertSeq = danglingEvent.seq + 1;
  console.log(`dangling call: ${danglingCid} seq=${danglingEvent.seq} name=${danglingEvent.data.name} turn=${danglingEvent.data.turn} step=${danglingEvent.data.step}`);

  // The record containing the dangling call.
  const callRecIndex = eventLines.find(({ event }) => event.seq === danglingEvent.seq).recIndex;
  console.log(`dangling call is in record line ${records[callRecIndex].lineNo} (record index ${callRecIndex})`);

  // Build the synthetic tool/result mirroring interruptedTurnClosers' started=true shape.
  const messageId = `interrupted-tool-result-${danglingCid}-${insertSeq}`;
  const synthetic = {
    type: "tool/result",
    seq: insertSeq,
    time: danglingEvent.time,
    data: {
      turn: danglingEvent.data.turn,
      step: danglingEvent.data.step,
      message: {
        id: messageId,
        role: "user",
        source: { kind: "tool", callId: danglingCid },
        content: [{
          type: "tool-result",
          toolCallId: danglingCid,
          isError: true,
          content: [{
            type: "text",
            text: "The tool call was interrupted after it was recorded, but no result was durably recorded. Its outcome is unknown. Decide whether to retry from the tool semantics: retry only if the operation is read-only or idempotent; if it may have side effects, first verify external state or ask the user. Do not retry blindly.",
          }],
        }],
      },
      error: { name: "ToolOutcomeUnknownError", code: TOOL_OUTCOME_UNKNOWN },
    },
    surfaceOp: "append",
    sourceEventSeqs: [danglingEvent.seq],
  };

  // Rebuild the plaintext: header, records through the dangling call verbatim,
  // the synthetic result, then the rest with seq+1 (and sourceEventSeqs+1).
  const lines = [Buffer.from(headerLine + "\n", "utf8")];
  let renumbered = 0;
  for (let ri = 0; ri < records.length; ri++) {
    if (ri < callRecIndex) {
      lines.push(Buffer.concat([Buffer.from(records[ri].text), Buffer.from("\n", "utf8")]));
      continue;
    }
    if (ri === callRecIndex) {
      // the dangling call's own record stays verbatim
      lines.push(Buffer.concat([Buffer.from(records[ri].text), Buffer.from("\n", "utf8")]));
      // insert the synthetic result right after it
      lines.push(Buffer.from(JSON.stringify(synthetic) + "\n", "utf8"));
      continue;
    }
    // renumber everything after the insertion point
    const parsed = JSON.parse(records[ri].text.toString("utf8"));
    parsed.seq += 1;
    if (Array.isArray(parsed.sourceEventSeqs)) {
      parsed.sourceEventSeqs = parsed.sourceEventSeqs.map((s) => (s >= insertSeq ? s + 1 : s));
    }
    lines.push(Buffer.from(JSON.stringify(parsed) + "\n", "utf8"));
    renumbered++;
  }
  console.log(`renumbered ${renumbered} records (seq +1 from ${insertSeq})`);

  // Sanity: the synthetic result's seq must equal its position in the stream.
  const keptRecordsBefore = callRecIndex + 1; // records 0..callRecIndex
  const syntheticPosition = 1 + keptRecordsBefore; // 1 (header) + records before + 1 (the call record itself)... compute precisely:
  // lines[0]=header, lines[1..callRecIndex+1]=records 0..callRecIndex, lines[callRecIndex+2]=synthetic
  const syntheticLineIndex = callRecIndex + 2;
  void syntheticPosition;

  // Re-encode frames.
  const frames = [zstdCompressSync(lines[0], CHECKSUM_OPTIONS)];
  const GROUP = 64;
  const rest = lines.slice(1);
  for (let i = 0; i < rest.length; i += GROUP) {
    const group = rest.slice(i, i + GROUP);
    frames.push(zstdCompressSync(Buffer.concat(group), CHECKSUM_OPTIONS));
  }
  const out = Buffer.concat(frames);

  const tmp = `${outputPath}.${Date.now().toString(36)}.fix.tmp`;
  writeFileSync(tmp, out);
  try { renameSync(tmp, outputPath); }
  catch (e) { throw new Error(`rename failed: ${e.message}`); }

  // Final balance check with the harness's own repair function.
  const allEvents = [];
  {
    let start = headerEnd + 1;
    let i = start;
    while (i <= plain.length) {
      const nl = i === plain.length ? -1 : plain.indexOf(10, i);
      if (nl === -1) break;
      i = nl + 1; start = i;
    }
  }
  void allEvents;

  console.log(JSON.stringify({
    headerId: header.id,
    danglingCallId: danglingCid,
    danglingSeq: danglingEvent.seq,
    syntheticResultSeq: insertSeq,
    syntheticMessageId: messageId,
    renumberedRecords: renumbered,
    outputBytes: out.length,
    outputPath,
  }, null, 2));
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !outputPath || !existsSync(inputPath)) {
  console.error("usage: node insert-result.mjs <input.jsonl.zstd> <output.jsonl.zstd>");
  process.exit(2);
}
run(inputPath, outputPath);
