// CDP 检查：验证标题栏注入、preload 桥、页面渲染状态
// 用法: node scripts/cdp-check.mjs <port>
const port = process.argv[2] || "9333";

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const page = list.find((t) => t.type === "page");
  if (!page) throw new Error("no page target");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  };
  const send = (method, params = {}) => new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  const evalJs = async (expression) => {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    return res.result && res.result.result ? res.result.result.value : JSON.stringify(res);
  };

  const report = await evalJs(`(async () => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    // 等待 DSH 应用挂载
    for (let i = 0; i < 40; i++) {
      if (document.querySelector('#root') && document.querySelector('#root').children.length > 0) break;
      await sleep(500);
    }
    const bar = document.getElementById('dsh-titlebar');
    const mark = document.querySelector('#dsh-titlebar .dsh-tb-mark');
    const root = document.getElementById('root');
    const cs = bar ? getComputedStyle(bar) : null;
    const bridge = window.dshDesktop || null;
    let version = null;
    try { version = bridge ? await bridge.getVersion() : null; } catch (e) { version = 'ERR ' + e.message; }
    return {
      titlebarExists: !!bar,
      titlebarHeight: cs ? cs.height : null,
      titlebarBackdrop: cs ? cs.backdropFilter : null,
      titlebarBackground: cs ? cs.background : null,
      titlebarAppRegion: cs ? cs.webkitAppRegion : null,
      brandMark: mark ? mark.getAttribute('width') + 'x' + mark.getAttribute('height') : null,
      brandText: document.querySelector('#dsh-titlebar .dsh-tb-brand span')?.textContent ?? null,
      updateBtn: !!document.getElementById('dsh-tb-update'),
      rootPaddingTop: root ? getComputedStyle(root).paddingTop : null,
      rootChildren: root ? root.children.length : null,
      pageText: document.body ? document.body.innerText.slice(0, 200) : null,
      bridge: bridge ? Object.keys(bridge) : null,
      version,
      title: document.title,
      hasBootError: !!document.querySelector('[class*="failed"]')
    };
  })()`);

  console.log(JSON.stringify(report, null, 2));
  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
