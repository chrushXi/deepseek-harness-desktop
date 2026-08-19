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
console.log(`events=${events.length}`);

// Replicate interruptedTurnClosers' scan, logging the tail state.
let openTurn = null, openStep = null;
const pendingCalls = new Map();
const tail = [];
for (const event of events) {
  let action = "";
  switch (event.type) {
    case "turn/start": openTurn = event.data.turn; openStep = null; pendingCalls.clear(); action = `openTurn=${openTurn}, pending cleared`; break;
    case "turn/end": openTurn = null; openStep = null; pendingCalls.clear(); action = "turn closed"; break;
    case "step/start": openStep = event.data.step; action = `openStep=${openStep}`; break;
    case "step/end": pendingCalls.clear(); openStep = null; action = "step closed"; break;
    case "assistant/message": {
      const blocks = event.data?.message?.content ?? [];
      const toolBlocks = blocks.filter((b) => b.type === "tool-call");
      for (const b of toolBlocks) pendingCalls.set(b.id, { step: event.data.step });
      action = `assistant/message blocks=${blocks.length} toolBlocks=${toolBlocks.length} pending=${[...pendingCalls.keys()].join(",")}`;
      break;
    }
    case "tool/call": {
      const entry = pendingCalls.get(event.data.callId);
      if (entry) entry.callSeq = event.seq;
      action = `tool/call ${event.data.callId} entry=${entry ? `seq=${entry.callSeq}` : "NOT PENDING"}`;
      break;
    }
    case "tool/result": pendingCalls.delete(event.data.message?.source?.callId); action = "tool/result"; break;
    default: action = event.type;
  }
  if (event.seq >= 301000 || event.type === "turn/start" || event.type === "turn/end") {
    tail.push({ seq: event.seq, type: event.type, action, turn: event.data?.turn, step: event.data?.step });
  }
}
console.log(`final: openTurn=${openTurn} openStep=${openStep} pendingCalls=${[...pendingCalls.entries()].map(([k, v]) => `${k}@${v.callSeq ?? "?"}`).join(",") || "(empty)"}`);
console.log("\n--- tail trace (seq >= 301000 and all turn boundaries) ---");
for (const t of tail) console.log(`seq=${t.seq} ${t.type} turn=${t.turn ?? "-"} step=${t.step ?? "-"} | ${t.action}`);

// find turn/start 12 and the last turn/end before 301066
const turnStarts = events.filter((e) => e.type === "turn/start" && e.data.turn === 12);
console.log(`\nturn/start 12 events: ${turnStarts.length}`);
for (const e of turnStarts) console.log(`  seq=${e.seq} time=${e.time}`);
const lastTurnEnd = [...events].reverse().find((e) => e.type === "turn/end");
console.log(`last turn/end: seq=${lastTurnEnd?.seq} turn=${lastTurnEnd?.data?.turn} time=${lastTurnEnd?.time}`);

// the assistant message at 301065 - full content block types
const am = events.find((e) => e.seq === 301065);
if (am) {
  console.log(`\nassistant/message 301065 content blocks:`);
  for (const b of am.data.message.content) console.log(`  type=${b.type} id=${b.id ?? "-"} name=${b.name ?? "-"}`);
}

console.log(`\ninterruptedTurnClosers(events 0..301066) = ${JSON.stringify(interruptedTurnClosers(events.slice(0, 301067)))}`);
