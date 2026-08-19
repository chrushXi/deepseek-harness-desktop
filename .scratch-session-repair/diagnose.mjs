import { readFileSync, statSync } from "node:fs";
import { zstdDecompressSync } from "node:zlib";

const ZSTD_MAGIC = 4247762216; // 0xFD2FB528 little-endian

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
    if (checksum) {
      if (buffer.length - offset < 4) { if (tornStart === undefined) tornStart = start; break; }
      offset += 4;
    }
    frames.push({ start, end: offset });
  }
  return { frames, tornStart };
}

function analyze(path, label) {
  console.log(`\n===== ${label} =====`);
  const buffer = readFileSync(path);
  const st = statSync(path);
  console.log(`size=${buffer.length} mtime=${st.mtime.toISOString()}`);
  let scan;
  try {
    scan = scanZstdFrames(buffer);
  } catch (e) {
    console.log(`frame scan FAILED: ${e.message}`);
    return;
  }
  console.log(`frames=${scan.frames.length} tornStart=${scan.tornStart ?? "(none)"}`);
  let cumulative = 0;
  let badFrames = 0;
  for (let i = 0; i < scan.frames.length; i++) {
    const f = scan.frames[i];
    const bytes = buffer.subarray(f.start, f.end);
    let plain;
    try {
      plain = zstdDecompressSync(bytes);
    } catch (e) {
      console.log(`frame[${i}] bytes=${f.start}..${f.end} (${bytes.length}B) DECOMPRESS FAILED: ${e.message}`);
      badFrames++;
      continue;
    }
    const endsNl = plain.length > 0 && plain[plain.length - 1] === 10;
    const lineCount = countLines(plain);
    const tail = plain.subarray(Math.max(0, plain.length - 120)).toString("utf8").replace(/\n/g, "\\n");
    cumulative += plain.length;
    const flag = endsNl ? "" : "  <-- NO TRAILING NEWLINE (torn record!)";
    if (!endsNl || i >= scan.frames.length - 3) {
      console.log(`frame[${i}] file=${f.start}..${f.end} plain=${plain.length}B lines=${lineCount} cum=${cumulative}${flag}`);
      console.log(`   tail: ${tail}`);
    }
  }
  if (scan.tornStart !== undefined) {
    const tailBytes = buffer.subarray(scan.tornStart);
    console.log(`torn tail starts at ${scan.tornStart}, ${tailBytes.length}B; first 16 bytes: ${tailBytes.subarray(0,16).toString("hex")}`);
  }
  console.log(`badFrames=${badFrames}`);
}

function countLines(buf) {
  let n = 0;
  for (let i = 0; i < buf.length; i++) if (buf[i] === 10) n++;
  return n;
}

const DIR = "C:\\Users\\fengq\\.dsh\\sessions\\--D-Project-DeepSeekHarness--\\session-d36099c3-81a2-48a1-9e45-8db0be12e92a";
analyze(`${DIR}\\session.jsonl.zstd`, "session.jsonl.zstd (current)");
const bak = `${DIR}\\session.jsonl.zstd.bak-overlap-2026-08-19T04-41-26-622Z`;
try { analyze(bak, "bak-overlap backup"); } catch (e) { console.log(`backup missing: ${e.message}`); }
