// 验证弹窗主题化：标题栏收窄、无蓝色硬编码、跟随主题色
// 用法: node scripts/check-theme.mjs <cdpPort>
const port = process.argv[2] || "9351";
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

  // 等页面加载 + 主题变量生效
  for (let i = 0; i < 30; i++) {
    const brand = await evalJs(`getComputedStyle(document.documentElement).getPropertyValue('--dsw-alias-brand-primary').trim()`);
    if (brand) break;
    await sleep(1000);
  }
  console.log("THEME VARS:", JSON.stringify(await evalJs(`(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      brand: cs.getPropertyValue('--dsw-alias-brand-primary').trim(),
      bgModule: cs.getPropertyValue('--dsw-alias-bg-module-platform').trim(),
      colorScheme: cs.colorScheme
    };
  })()`)));

  // 打开弹窗（点击更新按钮 → up-to-date 状态，再看头部/卡片样式）
  for (let i = 0; i < 20; i++) { if (await evalJs("!!document.getElementById('dsh-tb-update')")) break; await sleep(500); }
  await evalJs("document.getElementById('dsh-tb-update').click()");
  await sleep(2500);

  const visual = await evalJs(`(() => {
    const dlg = document.getElementById('dsh-update-dialog');
    if (!dlg) return { dialog: false };
    const head = dlg.querySelector('.dsh-ud-head');
    const card = dlg.querySelector('.dsh-ud-card');
    const btn = dlg.querySelector('.dsh-ud-btn-primary');
    const mark = dlg.querySelector('.dsh-ud-mark');
    return {
      dialog: true,
      headHeight: head.getBoundingClientRect().height,
      headBg: getComputedStyle(head).backgroundColor,
      headBgImage: getComputedStyle(head).backgroundImage,
      cardBg: getComputedStyle(card).backgroundColor,
      cardBlur: getComputedStyle(card).backdropFilter,
      markColor: mark ? getComputedStyle(mark).color : null,
      primaryColor: btn ? getComputedStyle(btn).backgroundColor : null,
      primaryBgImage: btn ? getComputedStyle(btn).backgroundImage : null,
      titleSize: getComputedStyle(dlg.querySelector('.dsh-ud-title')).fontSize
    };
  })()`);
  console.log("DIALOG THEME:", JSON.stringify(visual));

  // 关闭弹窗
  await evalJs(`(() => { const b = document.querySelector('[data-act="close"]'); if (b) b.click(); return !!b; })()`);
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
