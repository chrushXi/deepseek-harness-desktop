// 检查更新按钮状态（有更新时应为绿色箭头）
// 用法: node scripts/check-update-btn.mjs <cdpPort>
const port = process.argv[2] || "9345";

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

  for (let i = 0; i < 20; i++) {
    if (await evalJs("!!document.getElementById('dsh-tb-update')")) break;
    await new Promise((r) => setTimeout(r, 500));
  }
  // 等自动检查完成（启动后约 4s + 网络）
  await new Promise((r) => setTimeout(r, 8000));

  const state = await evalJs(`({
    label: document.querySelector('.dsh-tb-update-label') ? document.querySelector('.dsh-tb-update-label').textContent : null,
    labelHidden: document.querySelector('.dsh-tb-update-label') ? document.querySelector('.dsh-tb-update-label').hidden : null,
    availHidden: document.querySelector('.dsh-tb-update-avail') ? document.querySelector('.dsh-tb-update-avail').hidden : null,
    availGreen: !!document.querySelector('.dsh-tb-update-avail svg circle[fill="#2ea043"]'),
    progressOn: document.getElementById('dsh-tb-progress') ? document.getElementById('dsh-tb-progress').classList.contains('dsh-tb-progress-on') : null,
    btnTitle: document.getElementById('dsh-tb-update') ? document.getElementById('dsh-tb-update').title : null
  })`);
  console.log("UPDATE BUTTON STATE:", JSON.stringify(state));
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
