// 自绘更新弹窗全流程测试（配合 scripts/fake-registry.mjs 使用）
// 用法: node scripts/test-update-dialog.mjs <cdpPort>
const port = process.argv[2] || "9347";

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

  const dialogState = () => evalJs(`(() => {
    const dlg = document.getElementById('dsh-update-dialog');
    if (!dlg) return { exists: false };
    return {
      exists: true,
      open: dlg.classList.contains('dsh-ud-open'),
      title: dlg.querySelector('#dsh-ud-title') ? dlg.querySelector('#dsh-ud-title').textContent : null,
      body: dlg.querySelector('#dsh-ud-body') ? dlg.querySelector('#dsh-ud-body').innerText.slice(0, 300) : null,
      actions: Array.from(dlg.querySelectorAll('[data-act]')).map(b => b.dataset.act),
      closeVisible: dlg.querySelector('#dsh-ud-close') ? getComputedStyle(dlg.querySelector('#dsh-ud-close')).display !== 'none' : null,
      hasProgressBar: !!dlg.querySelector('.dsh-ud-bar'),
      hasSpinner: !!dlg.querySelector('.dsh-ud-spinner'),
      cardBg: dlg.querySelector('.dsh-ud-card') ? getComputedStyle(dlg.querySelector('.dsh-ud-card')).backdropFilter : null
    };
  })()`);

  // 等待标题栏与弹窗监听就绪
  for (let i = 0; i < 24; i++) {
    if (await evalJs("!!document.getElementById('dsh-tb-update')")) break;
    await sleep(500);
  }

  // 1) 点击更新按钮 → 弹窗打开（checking → available）
  await evalJs("document.getElementById('dsh-tb-update').click()");
  await sleep(1500);
  console.log("STEP1 after click:", JSON.stringify(await dialogState()));

  // 等 available 状态（检查 + changelog 拉取）
  for (let i = 0; i < 30; i++) {
    const s = await dialogState();
    if (s.body && s.body.includes("发现新版本")) break;
    await sleep(1000);
  }
  const avail = await dialogState();
  console.log("STEP2 available:", JSON.stringify(avail));

  // 等 changelog 填充（npmmirror readme）
  await sleep(3000);
  console.log("STEP3 changelog:", JSON.stringify(await evalJs(`(() => {
    const box = document.getElementById('dsh-ud-changelog');
    return box ? { display: getComputedStyle(box).display, head: box.querySelector('.dsh-ud-cl-head')?.textContent, bodyLen: (box.querySelector('.dsh-ud-cl-body')?.textContent || '').length } : null;
  })()`)));

  // 2) 点击「立即更新」→ updating
  await evalJs(`(() => { const b = document.querySelector('[data-act="confirm"]'); if (b) b.click(); return !!b; })()`);
  await sleep(2000);
  console.log("STEP4 updating:", JSON.stringify(await dialogState()));

  // 3) 等 npm 安装失败（假 tarball 404）→ update-failed
  for (let i = 0; i < 90; i++) {
    const s = await dialogState();
    if (s.body && s.body.includes("更新失败")) break;
    await sleep(1000);
  }
  console.log("STEP5 failed:", JSON.stringify(await dialogState()));

  // 4) 点击「关闭」→ 弹窗关闭 + 页面刷新
  await evalJs(`(() => { const b = document.querySelector('[data-act="close"]'); if (b) b.click(); return !!b; })()`);
  await sleep(6000);
  console.log("STEP6 after close:", JSON.stringify(await dialogState()));

  ws.close();
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
