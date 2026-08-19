// 验证余额面板/计费设置样式
// 用法: node scripts/check-balance-panel.mjs <cdpPort>
const port = process.argv[2] || "9355";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = list.find((t) => t.type === "page");
  if (!page) throw new Error("no page");
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
    if (r.result && r.result.exceptionDetails) return "EXCEPTION: " + (r.result.exceptionDetails.exception?.description || "");
    return r.result && r.result.result ? r.result.result.value : JSON.stringify(r);
  };

  // 等标题栏
  for (let i = 0; i < 30; i++) {
    if (await evalJs("!!document.getElementById('dsh-tb-balance')")) break;
    await sleep(1000);
  }
  const hasBalance = await evalJs("!!document.getElementById('dsh-tb-balance')");
  console.log("balance widget:", hasBalance);

  // 触发右键打开面板
  await evalJs(`(() => {
    const el = document.getElementById('dsh-tb-balance');
    el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 10, clientY: 10 }));
    return true;
  })()`);
  await sleep(800);

  const panel = await evalJs(`(() => {
    const dlg = document.getElementById('dsh-tb-balance-panel');
    if (!dlg || !dlg.classList.contains('dsh-tb-panel-open')) return { open: false };
    const cs = getComputedStyle(dlg);
    const save = document.getElementById('dsh-tb-price-save');
    const input = document.querySelector('.dsh-tb-price-input');
    return {
      open: true,
      width: dlg.getBoundingClientRect().width,
      radius: cs.borderRadius,
      fontSize: cs.fontSize,
      bg: cs.backgroundColor,
      shadow: cs.boxShadow,
      titleWeight: getComputedStyle(dlg.querySelector('.dsh-tb-panel-title')).fontWeight,
      saveBtnBg: save ? getComputedStyle(save).backgroundColor : null,
      saveBtnRadius: save ? getComputedStyle(save).borderRadius : null,
      inputHeight: input ? getComputedStyle(input).height : null,
      inputRadius: input ? getComputedStyle(input).borderRadius : null,
      bodyText: dlg.innerText.slice(0, 200)
    };
  })()`);
  console.log("PANEL:", JSON.stringify(panel));

  // 打开计费设置
  await evalJs(`(() => { const b = document.getElementById('dsh-tb-price-toggle'); b.click(); return true; })()`);
  await sleep(1200);
  const pricing = await evalJs(`(() => {
    const p = document.getElementById('dsh-tb-pricing-panel');
    if (!p || !p.classList.contains('dsh-tb-pricing-open')) return { open: false };
    return {
      open: true,
      status: document.getElementById('dsh-tb-price-status')?.textContent,
      modelCount: document.querySelectorAll('#dsh-tb-price-model option').length,
      inputs: Array.from(document.querySelectorAll('.dsh-tb-price-input')).map(i => i.value).join(',')
    };
  })()`);
  console.log("PRICING:", JSON.stringify(pricing));

  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
