import { readFileSync } from "node:fs";
import { zstdDecompressSync } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire("D:\\DeepSeek Harness\\resources\\runtime\\node_modules\\@deepseek-ai\\dsh-session\\package.json");
const { decodeStorageRecord } = require("@deepseek-ai/dsh-session");

const ZSTD_MAGIC = 4247762216;
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

const path = process.argv[2];
const buffer = readFileSync(path);
const { frames, tornStart } = scanZstdFrames(buffer);
console.log(`size=${buffer.length} frames=${frames.length} tornStart=${tornStart ?? "(none)"}`);
const parts = [];
for (const f of frames) parts.push(zstdDecompressSync(buffer.subarray(f.start, f.end)));
const plain = Buffer.concat(parts);

// split into records
const records = [];
{
  const headerEnd = plain.indexOf(10);
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
console.log(`records=${records.length}`);

const events = [];
for (const rec of records) {
  try {
    const decoded = decodeStorageRecord(JSON.parse(rec.text.toString("utf8")));
    for (const e of decoded) events.push(e);
  } catch (e) { console.log(`unparsable line ${rec.lineNo}: ${e.message}`); }
}
console.log(`events=${events.length} first=${events[0]?.seq} last=${events[events.length - 1]?.seq}`);

// find dangling tool calls: tool/call with no subsequent tool/result citing its callId
const callIds = new Map(); // callId -> {seq, event}
const results = new Set();
for (const e of events) {
  if (e.type === "tool/call") callIds.set(e.data?.callId, { seq: e.seq, event: e });
  else if (e.type === "tool/result") {
    const id = e.data?.message?.source?.callId ?? e.data?.message?.source?.kind === "tool" ? e.data?.message?.source?.callId : undefined;
    // deriveEventMessage-style: tool result message source has callId
    const cid = e.data?.message?.source?.callId;
    if (cid) results.add(cid);
  }
}
console.log(`tool/call records: ${callIds.size}, tool/result cited callIds: ${results.size}`);

const dangling = [];
for (const [cid, { seq }] of callIds) if (!results.has(cid)) dangling.push({ cid, seq });
console.log(`dangling tool calls (no result): ${dangling.length}`);
for (const d of dangling) {
  const ev = callIds.get(d.cid).event;
  console.log(`  callId=${d.cid} seq=${d.seq} name=${ev.data?.name} turn=${ev.data?.turn} step=${ev.data?.step}`);
  console.log(`  arguments=${JSON.stringify(ev.data?.arguments)?.slice(0, 300)}`);
}

// print the last 15 events in full
console.log("\n--- last 15 events ---");
for (const e of events.slice(-15)) {
  console.log(`seq=${e.seq} type=${e.type} time=${e.time}`);
  console.log(`  ${JSON.stringify(e.data ?? e).slice(0, 500)}`);
}
