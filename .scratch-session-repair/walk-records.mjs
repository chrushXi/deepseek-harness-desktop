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
    const descriptor = buffer.readUInt8(offset);
    offset += 1;
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
    if (checksum) {
      if (buffer.length - offset < 4) { if (tornStart === undefined) tornStart = start; break; }
      offset += 4;
    }
    frames.push({ start, end: offset });
  }
  return { frames, tornStart };
}

function decodeAll(path) {
  const buffer = readFileSync(path);
  const { frames, tornStart } = scanZstdFrames(buffer);
  const parts = [];
  for (const f of frames) parts.push(zstdDecompressSync(buffer.subarray(f.start, f.end)));
  return { plain: Buffer.concat(parts), frames, tornStart, buffer };
}

// Walk every record; report duplicates and the final state.
function walkRecords(plain, label) {
  const headerEnd = plain.indexOf(10);
  const header = plain.subarray(0, headerEnd).toString("utf8");
  const events = [];
  let count = 0; // committed event count
  let lineNo = 0;
  let lineStart = headerEnd + 1;
  let i = headerEnd + 1;
  const len = plain.length;
  const duplicates = [];
  let firstGap = null;
  let last = null;
  let droppedBytes = 0;

  const lines = [];
  while (i < len) {
    const nl = plain.indexOf(10, i);
    if (nl === -1) {
      lines.push({ lineNo: ++lineNo, start: lineStart, end: len, text: plain.subarray(lineStart, len), torn: true });
      break;
    }
    lines.push({ lineNo: ++lineNo, start: lineStart, end: nl, text: plain.subarray(lineStart, nl), torn: false });
    i = nl + 1;
    lineStart = i;
  }

  for (const rec of lines) {
    if (rec.torn) { console.log(`${label}: TORN TAIL line ${rec.lineNo} (${rec.end - rec.start}B) — ${rec.text.toString("utf8").slice(0,200)}`); continue; }
    let decoded;
    try {
      decoded = decodeStorageRecord(JSON.parse(rec.text.toString("utf8")));
    } catch (e) {
      console.log(`${label}: UNPARSABLE line ${rec.lineNo}: ${e.message}`);
      continue;
    }
    const firstSeq = decoded[0]?.seq;
    const lastSeq = decoded[decoded.length - 1]?.seq;
    if (firstSeq !== undefined && firstSeq < count) {
      duplicates.push({ lineNo: rec.lineNo, firstSeq, lastSeq, count, types: decoded.map((e) => e.type).join(","), time: decoded[0]?.time, text: rec.text.toString("utf8").slice(0, 160) });
      droppedBytes += rec.end - rec.start + 1;
      continue;
    }
    if (firstSeq !== undefined && firstSeq > count && firstGap === null) {
      firstGap = { lineNo: rec.lineNo, expected: count, got: firstSeq };
    }
    for (const event of decoded) {
      events.push(event);
      count++;
      last = event;
    }
  }
  console.log(`${label}: total lines=${lines.length} committed events=${count} duplicates=${duplicates.length} droppedBytes=${droppedBytes}`);
  if (firstGap) console.log(`${label}: FIRST SEQ GAP: expected ${firstGap.expected}, got ${firstGap.got} at line ${firstGap.lineNo}`);
  if (duplicates.length) {
    console.log(`${label}: duplicate records:`);
    for (const d of duplicates.slice(0, 20)) {
      console.log(`   line ${d.lineNo}: seq ${d.firstSeq}..${d.lastSeq} (committed=${d.count}) types=[${d.types}] time=${d.time}`);
      console.log(`     ${d.text}`);
    }
    if (duplicates.length > 20) console.log(`   ... and ${duplicates.length - 20} more`);
  }
  if (last) console.log(`${label}: last event seq=${last.seq} type=${last.type} time=${last.time}`);
  // tail summary: last 12 records (types + seq ranges + times)
  console.log(`${label}: last 12 records:`);
  const lastRecs = lines.slice(-12);
  for (const rec of lastRecs) {
    let t = "(torn)";
    if (!rec.torn) {
      try {
        const d = decodeStorageRecord(JSON.parse(rec.text.toString("utf8")));
        t = `seq ${d[0]?.seq}..${d[d.length-1]?.seq} [${d.map((e)=>e.type).join(",")}] t=${d[0]?.time}`;
      } catch (e) { t = `(unparsable: ${e.message})`; }
    }
    console.log(`   line ${rec.lineNo}: ${t}`);
  }
  return { count, duplicates, firstGap };
}

const DIR = "C:\\Users\\fengq\\.dsh\\sessions\\--D-Project-DeepSeekHarness--\\session-d36099c3-81a2-48a1-9e45-8db0be12e92a";
for (const [name, path] of [
  ["current", `${DIR}\\session.jsonl.zstd`],
  ["backup", `${DIR}\\session.jsonl.zstd.bak-overlap-2026-08-19T04-41-26-622Z`],
]) {
  const { plain } = decodeAll(path);
  console.log(`\n===== ${name} (plaintext ${plain.length}B) =====`);
  walkRecords(plain, name);
}
