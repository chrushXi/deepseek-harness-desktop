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

function findSeqGap(plain, label, maxIssues = 8) {
  const headerEnd = plain.indexOf(10);
  const events = [];
  let committedBytes = headerEnd + 1;
  let issue = null;
  let lineNo = 0;
  let lineStart = headerEnd + 1;
  let i = headerEnd + 1;
  const len = plain.length;
  let issues = 0;
  let lastCommittedEvent = null;

  while (i < len) {
    const nl = plain.indexOf(10, i);
    if (nl === -1) {
      console.log(`${label}: final line without newline at byte ${lineStart} (${len - lineStart}B)`);
      return;
    }
    const line = plain.subarray(lineStart, nl);
    lineNo += 1;
    try {
      const decoded = decodeStorageRecord(JSON.parse(line.toString("utf8")));
      if (issue) {
        if (decoded.some((e) => e.type === "turn/end")) issues++;
        if (issues > maxIssues) return;
        i = nl + 1; lineStart = i;
        continue;
      }
      const rowStart = events.length;
      let rowOk = true;
      for (const event of decoded) {
        if (event.seq !== events.length) {
          issue = new Error(`seq gap at line ${lineNo} (expected ${events.length}, got ${event.seq})`);
          console.log(`${label}: SEQ GAP at JSONL line #${lineNo}, plaintext byte ${lineStart}..${nl}`);
          console.log(`   error: ${issue.message}`);
          console.log(`   last committed event: seq=${lastCommittedEvent?.seq} type=${lastCommittedEvent?.type} time=${lastCommittedEvent?.time}`);
          console.log(`   offending record: ${line.toString("utf8").slice(0, 500)}`);
          events.length = rowStart;
          rowOk = false;
          break;
        }
        events.push(event);
        lastCommittedEvent = event;
      }
      if (rowOk) committedBytes = nl + 1;
      else { issues++; if (issues > maxIssues) return; }
    } catch (e) {
      issue = new Error(`unparsable line ${lineNo}: ${e.message}`);
      console.log(`${label}: UNPARSABLE at JSONL line #${lineNo}, plaintext byte ${lineStart}..${nl}`);
      console.log(`   content: ${line.toString("utf8").slice(0, 500)}`);
      issues++; if (issues > maxIssues) return;
    }
    i = nl + 1;
    lineStart = i;
  }
  console.log(`${label}: scan done — committed ${events.length} events, committedBytes=${committedBytes}/${len}, issues=${issues}`);
}

const DIR = "C:\\Users\\fengq\\.dsh\\sessions\\--D-Project-DeepSeekHarness--\\session-d36099c3-81a2-48a1-9e45-8db0be12e92a";
for (const [name, path] of [
  ["current", `${DIR}\\session.jsonl.zstd`],
  ["backup", `${DIR}\\session.jsonl.zstd.bak-overlap-2026-08-19T04-41-26-622Z`],
]) {
  const { plain } = decodeAll(path);
  console.log(`\n===== ${name} =====`);
  findSeqGap(plain, name);
}
