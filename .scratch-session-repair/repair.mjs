/**
 * Repair a DSH JSONL session log whose complete zstd frames contain duplicated
 * event records (seq overlap). The persistence reader hard-fails on any seq
 * overlap ("corrupt Zstandard session log: complete frame contains a torn
 * JSONL record"), so the log becomes unreadable past the first duplicate.
 *
 * Strategy: decode all frames -> plaintext, walk every JSONL record with the
 * same decodeStorageRecord the reader uses, DROP records whose first event
 * seq is already committed (whole-batch duplicates), then re-encode into a
 * fresh concatenated-frame file (frame 0 = exactly the header line).
 *
 * Usage: node repair.mjs <input.jsonl.zstd> <output.jsonl.zstd>
 * Safe: never mutates the input; writes output via temp + atomic rename.
 */
import { readFileSync, writeFileSync, renameSync, existsSync } from "node:fs";
import { zstdDecompressSync, zstdCompressSync, constants } from "node:zlib";
import { createRequire } from "node:module";

const require = createRequire("D:\\DeepSeek Harness\\resources\\runtime\\node_modules\\@deepseek-ai\\dsh-session\\package.json");
const { decodeStorageRecord } = require("@deepseek-ai/dsh-session");

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

function decodeAll(path) {
  const buffer = readFileSync(path);
  const { frames, tornStart } = scanZstdFrames(buffer);
  if (tornStart !== undefined) {
    // If the final frame is structurally incomplete we refuse: the format's own
    // crash-recovery handles torn frames; this repair targets only the
    // duplicate-record corruption inside complete frames.
    throw new Error(`input has a torn (incomplete) final frame at byte ${tornStart}; not a duplicate-record corruption — aborting`);
  }
  const parts = [];
  for (const f of frames) {
    try { parts.push(zstdDecompressSync(buffer.subarray(f.start, f.end))); }
    catch (e) { throw new Error(`frame ${f.start}..${f.end} failed to decompress: ${e.message}`); }
  }
  return { plain: Buffer.concat(parts), frames, buffer };
}

function repair(inputPath, outputPath) {
  const { plain } = decodeAll(inputPath);
  const headerEnd = plain.indexOf(10);
  if (headerEnd === -1) throw new Error("no newline in log — cannot split header");
  const headerLine = plain.subarray(0, headerEnd).toString("utf8");
  let header;
  try { header = JSON.parse(headerLine); } catch (e) { throw new Error(`header line is not JSON: ${e.message}`); }
  if (header.type !== "session" || typeof header.id !== "string") throw new Error("first line is not a session header");

  // Split into records (all newline-terminated in a healthy log).
  const records = [];
  {
    let start = headerEnd + 1;
    let i = start;
    let lineNo = 0;
    while (i <= plain.length) {
      const nl = i === plain.length ? -1 : plain.indexOf(10, i);
      if (nl === -1) {
        if (i < plain.length) throw new Error(`torn tail without newline at byte ${i} (${plain.length - i}B)`);
        break;
      }
      lineNo += 1;
      records.push({ lineNo, start, end: nl, text: plain.subarray(start, nl) });
      i = nl + 1;
      start = i;
    }
  }

  // Walk records; drop whole-record duplicates; reject gaps / unparsable rows.
  let count = 0;
  let dropped = 0;
  const kept = [];
  const dupLines = [];
  for (const rec of records) {
    let decoded;
    try { decoded = decodeStorageRecord(JSON.parse(rec.text.toString("utf8"))); }
    catch (e) { throw new Error(`unparsable record at line ${rec.lineNo}: ${e.message}`); }
    const firstSeq = decoded[0]?.seq;
    const lastSeq = decoded[decoded.length - 1]?.seq;
    if (firstSeq !== undefined && firstSeq < count) {
      // Whole-batch duplicate (its events were already committed).
      dropped += 1;
      dupLines.push({ lineNo: rec.lineNo, firstSeq, lastSeq, count });
      continue;
    }
    if (firstSeq !== undefined && firstSeq > count) {
      throw new Error(`seq gap at line ${rec.lineNo}: expected ${count}, got ${firstSeq} — data loss, not a duplicate; aborting`);
    }
    for (const event of decoded) {
      if (event.seq !== count) throw new Error(`non-contiguous seq inside record at line ${rec.lineNo}: expected ${count}, got ${event.seq}`);
      count += 1;
    }
    kept.push(rec.text);
  }

  // Re-encode: frame 0 = exactly the header line; then grouped event records
  // (each record keeps its own trailing newline).
  const headerFrame = zstdCompressSync(Buffer.from(headerLine + "\n", "utf8"), CHECKSUM_OPTIONS);
  const frames = [headerFrame];
  const GROUP = 64;
  for (let i = 0; i < kept.length; i += GROUP) {
    const group = kept.slice(i, i + GROUP);
    const body = Buffer.concat(group.map((b) => Buffer.concat([Buffer.from(b), Buffer.from("\n", "utf8")])));
    frames.push(zstdCompressSync(body, CHECKSUM_OPTIONS));
  }
  const out = Buffer.concat(frames);

  // Atomic write: temp + rename.
  const tmp = `${outputPath}.${Date.now().toString(36)}.repair.tmp`;
  writeFileSync(tmp, out);
  try { renameSync(tmp, outputPath); }
  catch (e) { throw new Error(`rename failed: ${e.message}`); }

  console.log(JSON.stringify({
    headerId: header.id,
    inputFrames: null, // set below
    records: records.length,
    keptRecords: kept.length,
    droppedDuplicateRecords: dropped,
    dupLines,
    eventsCommitted: count,
    outputBytes: out.length,
    outputPath,
  }, null, 2));
  return { count, dropped, dupLines };
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !outputPath || !existsSync(inputPath)) {
  console.error("usage: node repair.mjs <input.jsonl.zstd> <output.jsonl.zstd>");
  process.exit(2);
}
repair(inputPath, outputPath);
