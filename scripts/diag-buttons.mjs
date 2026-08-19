// 按钮诊断：区分「事件未绑定」与「IPC/主进程失效」
// 用法: node scripts/diag-buttons.mjs <cdpPort>
const port = process.argv[2] || "9343";

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

  for (let i = 0; i < 20; i++) {
    if (await evalJs("!!document.getElementById('dsh-tb-max')")) break;
    await new Promise((r) => setTimeout(r, 500));
  }

  const dims = () => evalJs(`({
    vis: document.visibilityState,
    focused: document.hasFocus(),
    outer: [window.outerWidth, window.outerHeight],
    inner: [window.innerWidth, window.innerHeight],
    avail: [screen.availWidth, screen.availHeight],
    bridge: typeof window.dshDesktop
  })`);

  console.log("START:", JSON.stringify(await dims()));

  // 路径 A：直接调用 bridge（绕过按钮点击）
  console.log("A1 direct bridge toggleMaximize()...");
  await evalJs("window.dshDesktop.toggleMaximize()");
  await new Promise((r) => setTimeout(r, 1500));
  console.log("A1 result:", JSON.stringify(await dims()));

  // 还原
  await evalJs("window.dshDesktop.toggleMaximize()");
  await new Promise((r) => setTimeout(r, 1500));

  // 路径 B：点击按钮
  console.log("B1 click #dsh-tb-max ...");
  await evalJs("document.getElementById('dsh-tb-max').click()");
  await new Promise((r) => setTimeout(r, 1500));
  console.log("B1 result:", JSON.stringify(await dims()));

  // 检查按钮上是否真的绑了监听器（用 getEventListeners 需要 DevTools 协议 DOMDebugger）
  const hasListener = await evalJs(`(() => {
    const btn = document.getElementById('dsh-tb-max');
    return btn ? (btn.__dshTestProbe = (btn.__dshTestProbe || 0) + 1, 'probe ok') : 'no btn';
  })()`);
  console.log("probe:", hasListener);

  // 新绑一个监听器，看 click 能否触发（排除 app-region/事件层问题）
  const clickProbe = await evalJs(`(() => {
    let fired = 0;
    const btn = document.getElementById('dsh-tb-max');
    if (!btn) return { fired, error: 'no button' };
    btn.addEventListener('click', () => { fired++; });
    btn.click();
    return { fired, drag: getComputedStyle(btn).webkitAppRegion || getComputedStyle(btn).appRegion || null };
  })()`);
  console.log("CLICK PROBE:", JSON.stringify(clickProbe));

  // 捕获页面 console 错误（预加载脚本报错会在这里出现）
  await send("Runtime.enable");
  const errors = [];
  const onConsole = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
      errors.push(m.params.args.map((a) => a.value || a.description).join(" "));
    }
    if (m.method === "Runtime.exceptionThrown") {
      errors.push("EXCEPTION: " + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
    }
  };
  ws.addEventListener("message", onConsole);
  // 触发一次页面错误收集（刷新页面重跑 preload，捕获注入异常）
  await send("Page.enable");
  await send("Page.reload");
  await new Promise((r) => setTimeout(r, 8000));
  ws.removeEventListener("message", onConsole);
  console.log("CONSOLE ERRORS:", errors.length ? JSON.stringify(errors, null, 2) : "(none captured)");

  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
