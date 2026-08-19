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

// Exact replica of the bundled SessionLogScanner.
class Scanner {
  constructor(headerRecord) {
    this.meta = JSON.parse(headerRecord.subarray(0, -1).toString("utf8"));
    this.events = [];
    this.fragments = [];
    this.fragmentBytes = 0;
    this.inputBytes = headerRecord.length;
    this.committedBytes = headerRecord.length;
    this.eventLine = 0;
    this.issue = undefined;
    this.finished = false;
  }
  write(chunk) {
    if (this.finished) throw new Error("cannot write to a finished session log scanner");
    const chunkStart = this.inputBytes;
    this.inputBytes += chunk.length;
    let lineStart = 0;
    for (let newline = chunk.indexOf(10); newline !== -1; newline = chunk.indexOf(10, lineStart)) {
      const fragment = chunk.subarray(lineStart, newline);
      let line = fragment;
      if (this.fragments.length > 0) {
        if (fragment.length > 0) this.fragments.push(fragment);
        line = Buffer.concat(this.fragments, this.fragmentBytes + fragment.length);
        this.fragments = [];
        this.fragmentBytes = 0;
      }
      this.consumeEventLine(line, chunkStart + newline + 1);
      lineStart = newline + 1;
    }
    if (lineStart < chunk.length) {
      const fragment = Buffer.from(chunk.subarray(lineStart));
      this.fragments.push(fragment);
      this.fragmentBytes += fragment.length;
    }
  }
  checkpoint() {
    return { inputBytes: this.inputBytes, committedBytes: this.committedBytes, eventCount: this.events.length };
  }
  consumeEventLine(line, endByte) {
    this.eventLine += 1;
    let decoded;
    try { decoded = decodeStorageRecord(JSON.parse(line.toString("utf8"))); }
    catch (e) { this.issue ??= new Error(`unparsable committed event at line ${this.eventLine}: ${e.message}`); return; }
    if (this.issue !== undefined) {
      if (decoded.some((event) => event.type === "turn/end")) throw this.issue;
      return;
    }
    const rowStart = this.events.length;
    for (const event of decoded) {
      if (event.seq !== this.events.length) {
        const expected = this.events.length;
        this.events.length = rowStart;
        this.issue = new Error(`seq gap in committed region at line ${this.eventLine} (expected ${expected}, got ${event.seq})`);
        if (decoded.some((candidate) => candidate.type === "turn/end")) throw this.issue;
        return;
      }
      this.events.push(event);
    }
    this.committedBytes = endByte;
  }
}

function analyze(path, label) {
  const buffer = readFileSync(path);
  const { frames, tornStart } = scanZstdFrames(buffer);
  console.log(`\n===== ${label}: frames=${frames.length} tornStart=${tornStart ?? "(none)"} =====`);
  const scanner = new Scanner(zstdDecompressSync(buffer.subarray(frames[0].start, frames[0].end)));
  for (let i = 1; i < frames.length; i++) {
    let plain;
    try { plain = zstdDecompressSync(buffer.subarray(frames[i].start, frames[i].end)); }
    catch (e) { console.log(`frame ${i} decompress failed: ${e.message}`); continue; }
    scanner.write(plain);
  }
  const complete = scanner.checkpoint();
  console.log(`inputBytes=${complete.inputBytes} committedBytes=${complete.committedBytes} events=${complete.eventCount}`);
  console.log(`match=${complete.committedBytes === complete.inputBytes ? "YES" : "NO"}`);
  if (scanner.issue) console.log(`issue=${scanner.issue.message}`);
  if (complete.committedBytes !== complete.inputBytes) {
    // find the byte where committed stops: replay line boundaries to locate the record
    console.log(`uncommitted bytes: ${complete.inputBytes - complete.committedBytes}`);
  }
  return complete;
}

const DIR = "C:\\Users\\fengq\\.dsh\\sessions\\--D-Project-DeepSeekHarness--\\session-d36099c3-81a2-48a1-9e45-8db0be12e92a";
analyze(`${DIR}\\session.jsonl.zstd.repaired-test`, "repaired-test");
analyze(`${DIR}\\session.jsonl.zstd`, "original");
