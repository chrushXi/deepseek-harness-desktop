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
const { frames } = scanZstdFrames(buffer);
const parts = [];
for (const f of frames) parts.push(zstdDecompressSync(buffer.subarray(f.start, f.end)));
const plain = Buffer.concat(parts);

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
const events = [];
const byLine = [];
for (const rec of records) {
  try {
    const decoded = decodeStorageRecord(JSON.parse(rec.text.toString("utf8")));
    for (const e of decoded) { events.push(e); byLine.push(rec.lineNo); }
  } catch (e) { console.log(`unparsable line ${rec.lineNo}: ${e.message}`); }
}

console.log("--- events 301055..301110 (around the dangling call and insertion point) ---");
for (let i = 301055; i < events.length; i++) {
  const e = events[i];
  let d;
  try { d = JSON.stringify(e.data ?? e).slice(0, 260); } catch { d = String(e); }
  console.log(`seq=${e.seq} line=${byLine[i]} type=${e.type} time=${e.time} ${d}`);
}

// find a real tool/result for a pwsh call to mirror its shape exactly
console.log("\n--- example real tool/result records (first 2 + one for call_00_bmHY) ---");
let shown = 0;
for (const e of events) {
  if (e.type === "tool/result") {
    if (e.data?.message?.source?.callId === "call_00_bmHYzkOL8RfSquKVb7z94861") {
      console.log(`MATCH for dangling callId, seq=${e.seq}:`);
      console.log(JSON.stringify(e, null, 1));
    } else if (shown < 2) {
      console.log(`example #${shown + 1} seq=${e.seq} (name source):`);
      console.log(JSON.stringify(e, null, 1));
      shown++;
    }
  }
}
