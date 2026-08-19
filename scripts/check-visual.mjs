// 验证：无更新时按钮状态 + 弹窗视觉（遮罩/阴影/按钮纯色）
// 用法: node scripts/check-visual.mjs <cdpPort>
const port = process.argv[2] || "9349";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

  // 等页面 + 自动检查完成（renderer-ready 后 1.2s + 网络）
  for (let i = 0; i < 30; i++) {
    const s = await evalJs("({ tb: !!document.getElementById('dsh-tb-update'), label: document.querySelector('.dsh-tb-update-label')?.textContent })");
    if (s.tb && s.label === "更新") break;
    await sleep(1000);
  }
  console.log("BUTTON STATE:", JSON.stringify(await evalJs(`({
    label: document.querySelector('.dsh-tb-update-label')?.textContent,
    labelHidden: document.querySelector('.dsh-tb-update-label')?.hidden,
    availHidden: document.querySelector('.dsh-tb-update-avail')?.hidden,
    title: document.getElementById('dsh-tb-update')?.title
  })`)));

  // 打开弹窗（点更新按钮 → up-to-date 状态）
  await evalJs("document.getElementById('dsh-tb-update').click()");
  await sleep(2500);
  const visual = await evalJs(`(() => {
    const dlg = document.getElementById('dsh-update-dialog');
    const card = dlg.querySelector('.dsh-ud-card');
    const btn = dlg.querySelector('.dsh-ud-btn-primary');
    return {
      title: dlg.querySelector('#dsh-ud-title')?.textContent,
      body: dlg.querySelector('#dsh-ud-body')?.innerText.slice(0, 120),
      backdropBg: getComputedStyle(dlg).background,
      backdropBlur: getComputedStyle(dlg).backdropFilter,
      cardShadow: getComputedStyle(card).boxShadow,
      cardBlur: getComputedStyle(card).backdropFilter,
      primaryBg: btn ? getComputedStyle(btn).backgroundImage : null,
      primaryColor: btn ? getComputedStyle(btn).backgroundColor : null
    };
  })()`);
  console.log("DIALOG VISUAL:", JSON.stringify(visual));

  // 关闭弹窗
  await evalJs(`(() => { const b = document.querySelector('[data-act="close"]'); if (b) b.click(); return !!b; })()`);
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
