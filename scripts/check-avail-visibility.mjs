// 检查标题栏更新按钮元素的真实显示状态（hidden 属性 vs computed display）
const port = process.argv[2] || "9351";

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
  const r = await send("Runtime.evaluate", {
    expression: `(() => {
      const avail = document.querySelector('.dsh-tb-update-avail');
      const label = document.querySelector('.dsh-tb-update-label');
      return {
        availHiddenAttr: avail ? avail.hidden : null,
        availComputedDisplay: avail ? getComputedStyle(avail).display : null,
        availVisible: avail ? avail.getBoundingClientRect().width > 0 : null,
        labelText: label ? label.textContent : null,
        labelComputedDisplay: label ? getComputedStyle(label).display : null
      };
    })()`,
    returnByValue: true,
  });
  console.log(JSON.stringify(r.result.result.value));
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
