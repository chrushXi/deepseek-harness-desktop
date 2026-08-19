// 验证：峰谷保存/重置 + 保存状态即时生效提示
const port = process.argv[2] || "9359";
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
    if (r.result && r.result.exceptionDetails) return "EXCEPTION: " + (r.result.exceptionDetails.exception?.description || "");
    return r.result && r.result.result ? r.result.result.value : JSON.stringify(r);
  };

  for (let i = 0; i < 30; i++) {
    if (await evalJs("!!document.getElementById('dsh-tb-balance')")) break;
    await sleep(1000);
  }

  // 打开面板 + 计费设置
  await evalJs(`(() => { document.getElementById('dsh-tb-balance').dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true })); return true; })()`);
  await sleep(400);
  await evalJs(`(() => { document.getElementById('dsh-tb-price-toggle').click(); return true; })()`);
  await sleep(2000);

  console.log("PRICING:", JSON.stringify(await evalJs(`(() => ({
    status: document.getElementById('dsh-tb-price-status')?.textContent,
    peaks: Array.from(document.querySelectorAll('.dsh-tb-peak-input')).map(i => i.value)
  }))()`)));

  // 改峰谷段1 8-11 并保存
  await evalJs(`(() => {
    const ins = Array.from(document.querySelectorAll('.dsh-tb-peak-input'));
    ins[0].value = '8'; ins[1].value = '11';
    document.getElementById('dsh-tb-price-save').click();
    return true;
  })()`);
  await sleep(2000);
  console.log("AFTER SAVE:", JSON.stringify(await evalJs(`(() => ({
    status: document.getElementById('dsh-tb-price-status')?.textContent,
    peaks: Array.from(document.querySelectorAll('.dsh-tb-peak-input')).map(i => i.value)
  }))()`)));

  // 重置
  await evalJs(`(() => { document.getElementById('dsh-tb-price-reset').click(); return true; })()`);
  await sleep(2000);
  console.log("AFTER RESET:", JSON.stringify(await evalJs(`Array.from(document.querySelectorAll('.dsh-tb-peak-input')).map(i => i.value)`)));

  // 验证保存状态提示（绿色加粗 “立即生效”）出现
  await evalJs(`(() => {
    const ins = Array.from(document.querySelectorAll('.dsh-tb-peak-input'));
    ins[0].value = '10'; ins[1].value = '12';
    document.getElementById('dsh-tb-price-save').click();
    return true;
  })()`);
  await sleep(600);
  console.log("SAVE STATUS:", JSON.stringify(await evalJs(`(() => {
    const s = document.getElementById('dsh-tb-price-status');
    return { text: s?.textContent, okClass: s?.classList.contains('dsh-tb-price-status-ok') };
  })()`)));

  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
