/**
 * Scan every session log under the DSH sessions root with the REAL reader
 * (readPrefix), reporting OK / FAILED + reason. Also lists per-file stats.
 * Usage: node scan-all.mjs [root]
 */
import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { zstdDecompressSync } from "node:zlib";

const RUNTIME = "D:\\DeepSeek Harness\\resources\\runtime\\node_modules";
const { JsonlSessionPersistence } = await import(`file:///${RUNTIME}/@deepseek-ai/dsh-session-persistence-jsonl/lib/index.js`);

const root = process.argv[2] ?? "C:\\Users\\fengq\\.dsh\\sessions";

const backend = Object.create(JsonlSessionPersistence.prototype);
backend.root = root;
backend.compression = "zstd";
backend.packChunks = true;
backend.rootEncodingCheck = Promise.resolve();
backend.assertStoredIdentity = async () => {};

const logs = [];
for (const project of readdirSync(root, { withFileTypes: true })) {
  if (!project.isDirectory()) continue;
  const projectPath = join(root, project.name);
  for (const dir of readdirSync(projectPath, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const dirPath = join(projectPath, dir.name);
    for (const f of readdirSync(dirPath, { withFileTypes: true })) {
      if (f.isFile() && f.name === "session.jsonl.zstd") {
        const path = join(dirPath, f.name);
        const st = statSync(path);
        logs.push({ path, project: project.name, id: dir.name, size: st.size, mtime: st.mtime.toISOString() });
      }
    }
  }
}

console.log(`scanning ${logs.length} session logs under ${root}`);
let ok = 0, failed = 0;
for (const log of logs) {
  try {
    const result = await backend.readPrefix(log.path, log.id, undefined);
    const { meta, events } = result;
    console.log(`OK       ${log.id}  events=${events.length}  size=${log.size}  mtime=${log.mtime}`);
    ok++;
  } catch (e) {
    console.log(`FAILED   ${log.id}  size=${log.size}  mtime=${log.mtime}`);
    console.log(`         ${String(e.message ?? e).split("\n")[0]}`);
    failed++;
  }
}
console.log(`\nsummary: ok=${ok} failed=${failed}`);
