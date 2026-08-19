import { readFileSync } from "node:fs";
import { zstdDecompressSync } from "node:zlib";
const RUNTIME = "D:\\DeepSeek Harness\\resources\\runtime\\node_modules";
const { JsonlSessionPersistence } = await import(`file:///${RUNTIME}/@deepseek-ai/dsh-session-persistence-jsonl/lib/index.js`);
const path = process.argv[2];
const backend = Object.create(JsonlSessionPersistence.prototype);
backend.root = "C:\\Users\\fengq\\.dsh\\sessions";
backend.compression = "zstd";
backend.packChunks = true;
backend.rootEncodingCheck = Promise.resolve();
// readRaw uses findLog + identity; keep identity real so the final file is fully validated.
const buf = readFileSync(path);
const headerPlain = zstdDecompressSync(buf.subarray(0, firstFrameEnd(buf)));
const header = JSON.parse(headerPlain.toString("utf8").split("\n")[0]);
const raw = await backend.readRaw(header.id);
console.log(`readRaw OK: meta.id=${raw.meta.id} content=${raw.content.length} chars, first line: ${raw.content.split("\n")[0].slice(0, 120)}`);
function firstFrameEnd(b){let o=4;const d=b.readUInt8(o);o+=1;const csf=d>>>6,ss=(d&32)!==0,chk=(d&4)!==0,df=d&3,db=df===3?4:df,csb=csf===0?(ss?1:0):(1<<csf);o+=(ss?0:1)+db+csb;for(;;){const bh=b.readUIntLE(o,3);o+=3;const lb=(bh&1)!==0,bt=(bh>>>1)&3,bs=bh>>>3;o+=(bt===1?1:bs);if(lb)break;}if(chk)o+=4;return o;}
