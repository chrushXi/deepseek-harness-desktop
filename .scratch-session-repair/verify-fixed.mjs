/**
 * Verify the fixed log: real readPrefix, contiguous seqs, harness repair
 * balance (interruptedTurnClosers === []), and that the assistant tool_calls
 * message is immediately followed by its tool result.
 * Usage: node verify-fixed.mjs <session.jsonl.zstd>
 */
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { zstdDecompressSync } from "node:zlib";
import { createRequire } from "node:module";

const RUNTIME = "D:\\DeepSeek Harness\\resources\\runtime\\node_modules";
const { JsonlSessionPersistence } = await import(`file:///${RUNTIME}/@deepseek-ai/dsh-session-persistence-jsonl/lib/index.js`);
const require = createRequire(`${RUNTIME}/@deepseek-ai/dsh-session/package.json`);
const { decodeStorageRecord, interruptedTurnClosers } = require("@deepseek-ai/dsh-session");

const path = process.argv[2];
const backend = Object.create(JsonlSessionPersistence.prototype);
backend.root = "C:\\Users\\fengq\\.dsh\\sessions";
backend.compression = "zstd";
backend.packChunks = true;
backend.rootEncodingCheck = Promise.resolve();
if (basename(path) !== "session.jsonl.zstd") backend.assertStoredIdentity = async () => {};

// 1) Real reader
const result = await backend.readPrefix(path, undefined, undefined);
const { meta, events, tornMarker } = result;
console.log(`readPrefix OK: events=${events.length} tornMarker=${tornMarker ? JSON.stringify(tornMarker) : "(none)"}`);

// 2) contiguity
let bad = 0;
for (let i = 0; i < events.length; i++) if (events[i].seq !== i) { bad++; if (bad <= 5) console.log(`  seq mismatch at ${i}: got ${events[i].seq}`); }
console.log(`contiguity: ${bad === 0 ? `PASS (seq 0..${events.length - 1})` : `FAIL (${bad})`}`);
console.log(`first event: seq=${events[0].seq} type=${events[0].type}`);
console.log(`last event:  seq=${events[events.length - 1].seq} type=${events[events.length - 1].type} turn=${events[events.length - 1].data?.turn ?? "-"}`);

// 3) harness repair balance
const closers = interruptedTurnClosers(events);
console.log(`interruptedTurnClosers(events) = ${closers.length} → ${closers.length === 0 ? "BALANCED" : "STILL NEEDS REPAIR: " + closers.map((c) => c.type).join(",")}`);

// 4) dangling-call message balance: find assistant messages with tool-call blocks
//    and check the NEXT message-bearing event resolves each callId.
const callsNeedingResult = new Map(); // callId -> seq of the assistant/message or tool/call
const lastResultFor = new Map();
for (const e of events) {
  if (e.type === "assistant/message") {
    for (const b of e.data?.message?.content ?? []) {
      if (b.type === "tool-call") callsNeedingResult.set(b.id, e.seq);
    }
  } else if (e.type === "tool/call") {
    if (callsNeedingResult.has(e.data.callId)) callsNeedingResult.set(e.data.callId, e.seq);
  } else if (e.type === "tool/result") {
    const cid = e.data?.message?.source?.callId;
    if (cid) { lastResultFor.set(cid, e.seq); callsNeedingResult.delete(cid); }
  } else if (e.type === "user/message" || e.type === "turn/start" || e.type === "assistant/chunk") {
    // any of these between an open tool_calls message and its result = unbalanced
    // (only flag if there IS an open call)
    if (callsNeedingResult.size > 0 && e.type === "user/message") {
      console.log(`  WARN: user/message at seq ${e.seq} while calls pending: ${[...callsNeedingResult.keys()].join(",")}`);
    }
  }
}
console.log(`dangling after walk: ${callsNeedingResult.size === 0 ? "NONE (all tool calls answered)" : [...callsNeedingResult.entries()].map(([k, v]) => `${k}@msgseq=${v}`).join(",")}`);

// 5) The specific spot: seq 301065 assistant/message, 301066 tool/call, 301067 tool/result
const spot = events.filter((e) => e.seq >= 301064 && e.seq <= 301069).map((e) => `${e.seq}:${e.type}`);
console.log(`spot 301064..301069: ${spot.join("  ")}`);
const tr = events.find((e) => e.seq === 301067);
console.log(`synthetic result: ${JSON.stringify(tr).slice(0, 400)}`);
