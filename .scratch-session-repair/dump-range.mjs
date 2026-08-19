import { readFileSync } from "node:fs";
import { zstdDecompressSync } from "node:zlib";
import { createRequire } from "node:module";
const require = createRequire("D:\\DeepSeek Harness\\resources\\runtime\\node_modules\\@deepseek-ai\\dsh-session\\package.json");
const { decodeStorageRecord } = require("@deepseek-ai/dsh-session");
const ZSTD_MAGIC = 4247762216;
function scanZstdFrames(buffer) {
  const frames = [];
  let offset = 0;
  outer: while (offset < buffer.length) {
    const start = offset;
    if (buffer.length - offset < 4) break;
    if (buffer.readUInt32LE(offset) !== ZSTD_MAGIC) throw new Error(`bad magic ${offset}`);
    offset += 4;
    if (offset === buffer.length) break;
    const descriptor = buffer.readUInt8(offset); offset += 1;
    const contentSizeFlag = descriptor >>> 6;
    const singleSegment = (descriptor & 32) !== 0;
    const checksum = (descriptor & 4) !== 0;
    const dictionaryFlag = descriptor & 3;
    const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag;
    const contentSizeBytes = contentSizeFlag === 0 ? (singleSegment ? 1 : 0) : (1 << contentSizeFlag);
    const remainingHeaderBytes = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes;
    if (buffer.length - offset < remainingHeaderBytes) break;
    offset += remainingHeaderBytes;
    for (;;) {
      if (buffer.length - offset < 3) break outer;
      const blockHeader = buffer.readUIntLE(offset, 3);
      offset += 3;
      const lastBlock = (blockHeader & 1) !== 0;
      const blockType = (blockHeader >>> 1) & 3;
      const blockSize = blockHeader >>> 3;
      if (blockType === 3) throw new Error(`bad block ${offset - 3}`);
      const payloadBytes = blockType === 1 ? 1 : blockSize;
      if (buffer.length - offset < payloadBytes) break outer;
      offset += payloadBytes;
      if (lastBlock) break;
    }
    if (checksum) { if (buffer.length - offset < 4) break; offset += 4; }
    frames.push({ start, end: offset });
  }
  return { frames };
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
      for (const e of decodeStorageRecord(JSON.parse(plain.subarray(start, nl).toString("utf8")))) events.push(e);
    } catch (e) { console.log(`unparsable: ${e.message}`); }
    i = nl + 1; start = i;
  }
}
const from = Number(process.argv[3] ?? 301030);
const to = Number(process.argv[4] ?? 301080);
for (let i = from; i <= Math.min(to, events.length - 1); i++) {
  const e = events[i];
  const turn = e.data?.turn ?? "-";
  const step = e.data?.step ?? "-";
  let extra = "";
  if (e.type === "turn/end") extra = JSON.stringify(e.data?.reason ?? "");
  if (e.type === "step/start" || e.type === "step/end") extra = "";
  if (e.type === "assistant/chunk") extra = e.data?.chunk?.type ?? "";
  if (e.type === "tool/call") extra = `${e.data?.callId} ${e.data?.name}`;
  if (e.type === "assistant/message") extra = `blocks=${e.data?.message?.content?.map((b) => b.type).join(",")}`;
  if (e.type === "request/header") extra = "request-header";
  console.log(`seq=${e.seq} ${e.type} turn=${turn} step=${step} t=${e.time} ${extra}`);
}
