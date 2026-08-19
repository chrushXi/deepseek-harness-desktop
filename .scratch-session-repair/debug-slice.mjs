import { readFileSync } from "node:fs";
import { zstdDecompressSync } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire("D:\\DeepSeek Harness\\resources\\runtime\\node_modules\\@deepseek-ai\\dsh-session\\package.json");
const { decodeStorageRecord, interruptedTurnClosers } = require("@deepseek-ai/dsh-session");

const ZSTD_MAGIC = 4247762216;
function scanZstdFrames(buffer) {
  const frames = [];
  let offset = 0;
  let tornStart;
  outer: while (offset < buffer.length) {
    const start = offset;
    if (buffer.length - offset < 4) { if (tornStart === undefined) tornStart = start; break; }
    if (buffer.readUInt32LE(offset) !== ZSTD_MAGIC) throw new Error(`bad magic ${offset}`);
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
      if (blockType === 3) throw new Error(`bad block ${offset - 3}`);
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
const headerEnd = plain.indexOf(10);
const events = [];
{
  let start = headerEnd + 1;
  let i = start;
  while (i <= plain.length) {
    const nl = i === plain.length ? -1 : plain.indexOf(10, i);
    if (nl === -1) break;
    try {
      const decoded = decodeStorageRecord(JSON.parse(plain.subarray(start, nl).toString("utf8")));
      for (const e of decoded) events.push(e);
    } catch (e) { console.log(`unparsable: ${e.message}`); }
    i = nl + 1; start = i;
  }
}
console.log(`events.length=${events.length}`);
let mismatches = 0;
for (let i = 0; i < events.length; i++) if (events[i].seq !== i) { if (mismatches < 10) console.log(`seq mismatch at index ${i}: got ${events[i].seq}`); mismatches++; }
console.log(`seq/index mismatches: ${mismatches}`);

// run the exact scan on the slice 0..301066
function scanState(list) {
  let openTurn = null, openStep = null;
  const pendingCalls = new Map();
  for (const event of list) switch (event.type) {
    case "turn/start": openTurn = event.data.turn; openStep = null; pendingCalls.clear(); break;
    case "turn/end": openTurn = null; openStep = null; pendingCalls.clear(); break;
    case "step/start": openStep = event.data.step; break;
    case "step/end": pendingCalls.clear(); openStep = null; break;
    case "assistant/message": for (const b of event.data.message.content) if (b.type === "tool-call") pendingCalls.set(b.id, { step: event.data.step }); break;
    case "tool/call": { const e2 = pendingCalls.get(event.data.callId); if (e2) e2.callSeq = event.seq; } break;
    case "tool/result": pendingCalls.delete(event.data.message.source.callId); break;
  }
  return { openTurn, openStep, pending: [...pendingCalls.entries()].map(([k, v]) => `${k}@${v.callSeq ?? "?"}`) };
}

const slice = events.slice(0, 301067);
console.log(`slice length=${slice.length} last seq=${slice.at(-1)?.seq} last type=${slice.at(-1)?.type}`);
console.log(`slice scan state: ${JSON.stringify(scanState(slice))}`);
console.log(`closers(slice): ${JSON.stringify(interruptedTurnClosers(slice))}`);
