/**
 * Verify a repaired session log with the REAL persistence read path
 * (JsonlSessionPersistence.readPrefix -> readZstdPrefix, the exact code that
 * threw "corrupt Zstandard session log: complete frame contains a torn JSONL
 * record").
 *
 * Usage: node verify.mjs <session.jsonl.zstd>
 * If the path's basename is not the canonical `session.jsonl.zstd`, the
 * path-identity assertion is stubbed (the file is a candidate output); at the
 * canonical path it runs fully.
 */
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { zstdDecompressSync } from "node:zlib";

const RUNTIME = "D:\\DeepSeek Harness\\resources\\runtime\\node_modules";
const { JsonlSessionPersistence } = await import(`file:///${RUNTIME}/@deepseek-ai/dsh-session-persistence-jsonl/lib/index.js`);

const path = process.argv[2];
if (!path) { console.error("usage: node verify.mjs <path>"); process.exit(2); }

const ZSTD_MAGIC = 4247762216;
const buf = readFileSync(path);
if (buf.readUInt32LE(0) !== ZSTD_MAGIC) { console.log("not a zstd file"); process.exit(2); }

// First frame = header frame; extract the header line to learn the session id.
const headerPlain = zstdDecompressSync(buf.subarray(0, findFrameEnd(buf)));
const header = JSON.parse(headerPlain.toString("utf8").split("\n")[0]);
const id = header.id;
console.log(`verifying with real reader: id=${id} path=${path}`);

// Construct the backend WITHOUT the coordinator (read path only). The class
// methods used here only need root/compression/packChunks.
const backend = Object.create(JsonlSessionPersistence.prototype);
backend.root = "C:\\Users\\fengq\\.dsh\\sessions";
backend.compression = "zstd";
backend.packChunks = true;
backend.rootEncodingCheck = Promise.resolve();

if (basename(path) !== "session.jsonl.zstd") {
  // Candidate output at a non-canonical path: skip the path-identity assertion.
  backend.assertStoredIdentity = async () => {};
}

try {
  const result = await backend.readPrefix(path, id, undefined);
  const { meta, events, tornMarker } = result;
  console.log(`OK: meta.id=${meta.id} events=${events.length} revision=${result.revision}`);
  console.log(`tornMarker=${tornMarker ? JSON.stringify(tornMarker) : "(none)"}`);
  if (events.length > 0) {
    console.log(`first event: seq=${events[0].seq} type=${events[0].type} time=${events[0].time}`);
    const last = events[events.length - 1];
    console.log(`last event:  seq=${last.seq} type=${last.type} time=${last.time}`);
    let bad = 0;
    for (let i = 0; i < events.length; i++) if (events[i].seq !== i) { bad++; if (bad <= 5) console.log(`   seq mismatch at ${i}: got ${events[i].seq}`); }
    console.log(`contiguity: ${bad === 0 ? `PASS (seq 0..${events.length - 1})` : `FAIL (${bad} mismatches)`}`);
  }
  process.exit(0);
} catch (e) {
  console.log(`FAILED: ${e && e.stack ? e.stack : e}`);
  process.exit(1);
}

function findFrameEnd(buf) {
  let offset = 4;
  const descriptor = buf.readUInt8(offset); offset += 1;
  const contentSizeFlag = descriptor >>> 6;
  const singleSegment = (descriptor & 32) !== 0;
  const checksum = (descriptor & 4) !== 0;
  const dictionaryFlag = descriptor & 3;
  const dictionaryBytes = dictionaryFlag === 3 ? 4 : dictionaryFlag;
  const contentSizeBytes = contentSizeFlag === 0 ? (singleSegment ? 1 : 0) : (1 << contentSizeFlag);
  const remainingHeaderBytes = (singleSegment ? 0 : 1) + dictionaryBytes + contentSizeBytes;
  offset += remainingHeaderBytes;
  for (;;) {
    const blockHeader = buf.readUIntLE(offset, 3);
    offset += 3;
    const lastBlock = (blockHeader & 1) !== 0;
    const blockType = (blockHeader >>> 1) & 3;
    const blockSize = blockHeader >>> 3;
    const payloadBytes = blockType === 1 ? 1 : blockSize;
    offset += payloadBytes;
    if (lastBlock) break;
  }
  if (checksum) offset += 4;
  return offset;
}
