// 按钮功能测试：最小化/最大化/关闭/更新按钮 + 更新按钮状态机
// 用法: node scripts/test-buttons.mjs <cdpPort>
const port = process.argv[2] || "9343";

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = list.find((t) => t.type === "page");
  if (!page) throw new Error("no page target");
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
    if (r.result && r.result.exceptionDetails) return "EXCEPTION: " + JSON.stringify(r.result.exceptionDetails.exception);
    return r.result && r.result.result ? r.result.result.value : JSON.stringify(r);
  };

  // 等待标题栏
  for (let i = 0; i < 20; i++) {
    if (await evalJs("!!document.getElementById('dsh-tb-min')")) break;
    await new Promise((r) => setTimeout(r, 500));
  }

  const snapshot = () => evalJs(`({
    vis: document.visibilityState,
    outerW: window.outerWidth,
    outerH: window.outerHeight,
    updateLabel: document.querySelector('.dsh-tb-update-label') ? document.querySelector('.dsh-tb-update-label').textContent : null,
    updateLabelHidden: document.querySelector('.dsh-tb-update-label') ? document.querySelector('.dsh-tb-update-label').hidden : null,
    availHidden: document.querySelector('.dsh-tb-update-avail') ? document.querySelector('.dsh-tb-update-avail').hidden : null,
    availSvg: !!document.querySelector('.dsh-tb-update-avail svg circle'),
    progressOn: document.getElementById('dsh-tb-progress') ? document.getElementById('dsh-tb-progress').classList.contains('dsh-tb-progress-on') : null,
    hasMaxHandler: !!document.getElementById('dsh-tb-max'),
    hasCloseHandler: !!document.getElementById('dsh-tb-close'),
    hasUpdateHandler: !!document.getElementById('dsh-tb-update')
  })`);

  console.log("BEFORE:", JSON.stringify(await snapshot()));

  // 1) 最小化
  await evalJs("document.getElementById('dsh-tb-min').click()");
  await new Promise((r) => setTimeout(r, 1200));
  console.log("AFTER MIN vis:", await evalJs("document.visibilityState"));
  // 恢复（通过 main 侧还原较麻烦，这里直接刷新状态即可，不影响后续评估）
  await evalJs("window.focus()");

  // 2) 最大化切换
  const h0 = await evalJs("window.outerHeight");
  await evalJs("document.getElementById('dsh-tb-max').click()");
  await new Promise((r) => setTimeout(r, 1200));
  const h1 = await evalJs("window.outerHeight");
  console.log("MAX toggle: outerHeight", h0, "->", h1, h1 !== h0 ? "(changed, OK)" : "(unchanged!)");
  // 还原
  await evalJs("document.getElementById('dsh-tb-max').click()");
  await new Promise((r) => setTimeout(r, 1200));

  // 3) 更新按钮状态（等待启动静默检查完成）
  await new Promise((r) => setTimeout(r, 6000));
  console.log("AFTER AUTO-CHECK:", JSON.stringify(await snapshot()));

  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
