// 点击往返测试：click → 最大化? → click → 还原?
// 用法: node scripts/test-click-toggle.mjs <cdpPort>
const port = process.argv[2] || "9344";

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
  const evalJs = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    return r.result && r.result.result ? r.result.result.value : JSON.stringify(r);
  };

  const inner = () => evalJs("[window.innerWidth, window.innerHeight]");
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // 先通过 bridge 恢复为未最大化，保证起点确定
  const m0 = await evalJs("window.dshDesktop.isMaximized()");
  console.log("isMaximized at start:", m0);
  if (m0) { await evalJs("window.dshDesktop.toggleMaximize()"); await sleep(1200); }

  console.log("start inner:", JSON.stringify(await inner()));
  console.log("click 1 (expect maximize)...");
  await evalJs("document.getElementById('dsh-tb-max').click()");
  await sleep(1200);
  console.log("after click1 inner:", JSON.stringify(await inner()), "max:", await evalJs("window.dshDesktop.isMaximized()"));
  console.log("click 2 (expect restore)...");
  await evalJs("document.getElementById('dsh-tb-max').click()");
  await sleep(1200);
  console.log("after click2 inner:", JSON.stringify(await inner()), "max:", await evalJs("window.dshDesktop.isMaximized()"));
  console.log("click 3 (expect maximize again)...");
  await evalJs("document.getElementById('dsh-tb-max').click()");
  await sleep(1200);
  console.log("after click3 inner:", JSON.stringify(await inner()), "max:", await evalJs("window.dshDesktop.isMaximized()"));
  // 收尾还原
  await evalJs("window.dshDesktop.toggleMaximize()");
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
