// 转储 DSH 主题的 CSS 变量（body 上生效的值），找品牌色变量名
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
      const target = document.querySelector('#dsh-titlebar') || document.body;
      const cs = getComputedStyle(target);
      const out = {};
      for (let i = 0; i < cs.length; i++) {
        const name = cs[i];
        if (name.startsWith('--dsw') || name.startsWith('--ds-')) {
          out[name] = cs.getPropertyValue(name).trim();
        }
      }
      return out;
    })()`,
    returnByValue: true,
  });
  const vars = r.result.result.value;
  const interesting = {};
  for (const [k, v] of Object.entries(vars)) {
    if (/brand|primary|deepseek|accent|interactive-bg|button-floating|bg-module|bg-base/.test(k)) interesting[k] = v;
  }
  console.log(JSON.stringify(interesting, null, 2));
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
