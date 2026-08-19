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
    if (buffer.readUInt32LE(offset) !== ZSTD_MAGIC) throw new Error("bad magic");
    offset += 4;
    const d = buffer.readUInt8(offset); offset += 1;
    const csf = d >>> 6, ss = (d & 32) !== 0, chk = (d & 4) !== 0, df = d & 3;
    const db = df === 3 ? 4 : df, csb = csf === 0 ? (ss ? 1 : 0) : (1 << csf);
    const rhb = (ss ? 0 : 1) + db + csb;
    if (buffer.length - offset < rhb) break;
    offset += rhb;
    for (;;) {
      if (buffer.length - offset < 3) break outer;
      const bh = buffer.readUIntLE(offset, 3); offset += 3;
      const lb = (bh & 1) !== 0, bt = (bh >>> 1) & 3, bs = bh >>> 3;
      const pb = bt === 1 ? 1 : bs;
      if (buffer.length - offset < pb) break outer;
      offset += pb;
      if (lb) break;
    }
    if (chk) { if (buffer.length - offset < 4) break; offset += 4; }
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
{ let start = headerEnd + 1, i = start;
  while (i <= plain.length) {
    const nl = i === plain.length ? -1 : plain.indexOf(10, i);
    if (nl === -1) break;
    try { for (const e of decodeStorageRecord(JSON.parse(plain.subarray(start, nl).toString("utf8")))) events.push(e); } catch {}
    i = nl + 1; start = i;
  } }
console.log("--- all turn/start + turn/end with seq in [279500, 301100] ---");
for (const e of events) {
  if ((e.type === "turn/start" || e.type === "turn/end") && e.seq >= 279500 && e.seq <= 301100) {
    console.log(`seq=${e.seq} ${e.type} turn=${e.data?.turn} t=${e.time}`);
  }
}
console.log("--- all step/start + step/end with seq in [279600, 279800] ---");
for (const e of events) {
  if ((e.type === "step/start" || e.type === "step/end") && e.seq >= 279600 && e.seq <= 279800) {
    console.log(`seq=${e.seq} ${e.type} turn=${e.data?.turn} step=${e.data?.step} t=${e.time}`);
  }
}
