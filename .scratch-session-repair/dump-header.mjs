import { readFileSync } from "node:fs";
import { zstdDecompressSync } from "node:zlib";
const buf = readFileSync(process.argv[2]);
// find first frame end
let o = 4; const d = buf.readUInt8(o); o += 1;
const csf = d >>> 6, ss = (d & 32) !== 0, chk = (d & 4) !== 0, df = d & 3, db = df === 3 ? 4 : df, csb = csf === 0 ? (ss ? 1 : 0) : (1 << csf);
o += (ss ? 0 : 1) + db + csb;
for (;;) { const bh = buf.readUIntLE(o, 3); o += 3; const lb = (bh & 1) !== 0, bt = (bh >>> 1) & 3, bs = bh >>> 3; o += (bt === 1 ? 1 : bs); if (lb) break; }
if (chk) o += 4;
const h = zstdDecompressSync(buf.subarray(0, o)).toString("utf8").split("\n")[0];
console.log(h);
