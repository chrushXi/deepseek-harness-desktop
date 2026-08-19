"use strict";

/**
 * DeepSeek Harness Desktop —— Electron main process.
 *
 * 职责：
 *  1. 用软件包内捆绑的 Node 运行时隐藏启动 `dsh --profile web` 服务器（无需 cmd / npx）；
 *  2. 等待服务器就绪后，用毛玻璃半透明窗体加载本地 GUI（界面与 web 版完全一致）；
 *  3. 自绘标题栏（拖拽区 + 最小化/最大化/关闭 + 一键更新按钮）；
 *  4. 通过 npm 官方源（npmmirror，可回退 npmjs）实现一键更新，更新后重启生效。
 */

const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const { spawn, execFile } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const net = require("node:net");

const APP_NAME = "DeepSeek Harness";
const SERVER_READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 300;
/** 更新源：优先环境变量 DSH_UPDATE_REGISTRY（可指向内网镜像），否则官方镜像 + npmjs 回退 */
const DEFAULT_REGISTRIES = [
  process.env.DSH_UPDATE_REGISTRY,
  "https://registry.npmmirror.com",
  "https://registry.npmjs.org",
].filter(Boolean);

// ---------- 路径 ----------
const isDev = !app.isPackaged;
/** 运行时根目录：dev 下为项目 runtime/，打包后为 resources/runtime */
const RUNTIME_DIR = isDev
  ? path.join(__dirname, "runtime")
  : path.join(process.resourcesPath, "runtime");
const INTERNAL_DIR = isDev
  ? path.join(__dirname, "internal")
  : path.join(process.resourcesPath, "internal");

const NODE_EXE = path.join(RUNTIME_DIR, "node.exe");
const DSH_BIN = path.join(RUNTIME_DIR, "node_modules", "@deepseek-ai", "dsh", "lib", "bin.js");
const NPM_CLI = path.join(RUNTIME_DIR, "node_modules", "npm", "bin", "npm-cli.js");
const DSH_PKG_JSON = path.join(RUNTIME_DIR, "node_modules", "@deepseek-ai", "dsh", "package.json");
/** Desktop-bundled damage monitor layer; mounted automatically for every web boot. */
const DAMAGE_PULSE_PATCH = path.join(INTERNAL_DIR, "damage-pulse", "cordis.patch.yml");
const DAMAGE_PULSE_MODULE = path.join(INTERNAL_DIR, "damage-pulse");

function logsDir() {
  const dir = path.join(app.getPath("userData"), "logs");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
const SERVER_LOG = () => path.join(logsDir(), "server.log");

function log(line) {
  try {
    fs.appendFileSync(SERVER_LOG(), `${new Date().toISOString()} ${line}\n`);
  } catch { /* ignore */ }
}

// ---------- 版本 ----------
function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}
function bundledDshVersion() {
  const manifest = readJsonSafe(DSH_PKG_JSON);
  return manifest && typeof manifest.version === "string" ? manifest.version : "unknown";
}

// ---------- 单一实例 ----------
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

// ---------- 服务器子进程 ----------
let serverChild = null;
let quitting = false;
/** 是否为主动停止（更新等场景），此时子进程退出不算事故 */
let serverStopping = false;
/** 本次启动期间服务器 stderr 的累计文本（用于诊断/自愈判断） */
let startupStderr = "";

function killServerTree() {
  if (!serverChild) return;
  serverStopping = true;
  const pid = serverChild.pid;
  try { serverChild.kill(); } catch { /* ignore */ }
  serverChild = null;
  // Windows 下连带结束子进程树，避免残留 node 进程
  try {
    execFile("taskkill", ["/pid", String(pid), "/t", "/f"], { windowsHide: true }, () => {});
  } catch { /* ignore */ }
}

/** 挑选端口：优先 3080，被占用则交给系统随机分配（--port 0）。 */
function isPortFree(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once("error", () => resolve(false));
    tester.once("listening", () => tester.close(() => resolve(true)));
    tester.listen(port, "127.0.0.1");
  });
}

function probeHttp(port, pathname = "/") {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path: pathname, timeout: 1500 }, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

/**
 * DSH resolves profile loaders from its managed fallback directory. Keep the
 * desktop-owned bundle there so the user never has to install a plugin.
 */
function syncBundledDamagePulse() {
  const dshHome = process.env.DSH_HOME && process.env.DSH_HOME.trim() !== ""
    ? path.resolve(process.env.DSH_HOME)
    : path.join(os.homedir(), ".dsh");
  const target = path.join(dshHome, "profiles", "node_modules", "dsh-damage-pulse");
  if (!fs.existsSync(DAMAGE_PULSE_MODULE)) {
    throw new Error(`内置 damage-pulse bundle 缺失：${DAMAGE_PULSE_MODULE}`);
  }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(DAMAGE_PULSE_MODULE, target, { recursive: true, force: true });
  log(`bundled damage-pulse synced to ${target}`);
}

/** 启动 dsh web 服务器；返回其监听端口。 */
async function startServer(win) {
  syncBundledDamagePulse();
  const logPath = SERVER_LOG();
  log(`starting server: ${NODE_EXE} ${DSH_BIN} --profile web --patch ${DAMAGE_PULSE_PATCH} --port 0`);
  const child = spawn(NODE_EXE, [
    DSH_BIN,
    "--profile", "web",
    "--patch", DAMAGE_PULSE_PATCH,
    "--port", "0",
  ], {
    cwd: RUNTIME_DIR,
    env: { ...process.env, DSH_TELEMETRY_DISABLED: process.env.DSH_TELEMETRY_DISABLED || "" },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  serverChild = child;
  serverStopping = false;
  startupStderr = "";

  let port = null;
  const urlLine = /dsh web: http:\/\/127\.0\.0\.1:(\d+)/;
  child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    log(`[server] ${text.trim()}`);
    const m = text.match(urlLine);
    if (m && port === null) port = Number(m[1]);
  });
  child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    startupStderr = (startupStderr + text).slice(-8000);
    log(`[server:err] ${text.trim()}`);
  });
  child.on("exit", (code, signal) => {
    log(`server exited code=${code} signal=${signal} quitting=${quitting} stopping=${serverStopping}`);
    if (!quitting && !serverStopping) {
      dialog.showErrorBox(
        APP_NAME,
        `DeepSeek Harness 服务器意外退出（代码 ${code}）。\n日志：${logPath}`
      );
      app.quit();
    }
  });

  // 等待就绪：优先解析 stdout 端口，再轮询 HTTP 200
  const deadline = Date.now() + SERVER_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (port !== null) {
      const ok = await probeHttp(port);
      if (ok) return port;
    }
    if (child.exitCode !== null) break;
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  // 启动失败：先清理子进程
  quitting = true;
  killServerTree();

  // 常见可自愈错误：DSH 安装回退目录被外部工具改成真实目录
  // （官方 CLI 遇到同样错误会提示手动删除；这里提供一键自动修复）
  const symlinkErr = startupStderr.match(/dsh: (.+?) exists and is not a symlink/);
  if (symlinkErr) {
    const badPath = symlinkErr[1];
    const choice = dialog.showMessageBoxSync({
      type: "question",
      title: APP_NAME,
      message: "检测到 DSH 配置目录异常，可一键修复",
      detail:
        `DSH 的安装回退目录（$DSH_HOME/profiles/node_modules）中：\n${badPath}\n` +
        `被外部工具修改成了普通文件夹，导致服务器无法启动。\n` +
        `点击"自动修复"将删除该异常条目并重启服务器（该目录由 DSH 自动维护，可安全重建）。`,
      buttons: ["自动修复", "取消"],
      defaultId: 0,
      cancelId: 1,
    });
    if (choice === 0 && repairFallbackEntry(badPath)) {
      log("fallback repaired, restarting server");
      quitting = false;
      const repairedPort = await startServer(win);
      if (repairedPort !== null) return repairedPort;
      quitting = true;
      killServerTree();
    }
  }

  const reason =
    port === null
      ? "服务器启动超时，未能获得监听端口。"
      : `服务器就绪超时（http://127.0.0.1:${port} 无响应）。`;
  dialog.showErrorBox(APP_NAME, `${reason}\n日志：${logPath}`);
  app.exit(1);
  return null;
}

/** 自动修复 DSH 安装回退目录中被改成普通文件夹的条目（仅限 $DSH_HOME/profiles/node_modules 之内）。 */
function repairFallbackEntry(badPath) {
  const home = process.env.DSH_HOME && process.env.DSH_HOME.trim() !== ""
    ? path.resolve(process.env.DSH_HOME)
    : path.join(os.homedir(), ".dsh");
  const modulesRoot = path.resolve(path.join(home, "profiles", "node_modules"));
  const target = path.resolve(badPath);
  const prefix = modulesRoot.toLowerCase() + path.sep;
  if (!target.toLowerCase().startsWith(prefix)) {
    log(`repair refused: ${target} outside ${modulesRoot}`);
    return false;
  }
  try {
    fs.rmSync(target, { recursive: true, force: true });
    log(`repair: removed ${target}`);
    return true;
  } catch (err) {
    log(`repair failed: ${err.message}`);
    return false;
  }
}

// ---------- 更新 ----------
let updating = false;

function compareVersions(a, b) {
  // 尝试使用运行时自带的 semver；失败则退回简易比较
  try {
    const semver = require(path.join(RUNTIME_DIR, "node_modules", "semver"));
    return semver.compare(a, b);
  } catch {
    const parse = (v) => {
      const m = String(v).trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/);
      if (!m) return [0, 0, 0, ""];
      return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] || ""];
    };
    const [ma, pa, ra, prea] = parse(a);
    const [mb, pb, rb, preb] = parse(b);
    for (const [x, y] of [[ma, mb], [pa, pb], [ra, rb]]) {
      if (x !== y) return x > y ? 1 : -1;
    }
    if (prea === preb) return 0;
    if (prea === "") return 1;
    if (preb === "") return -1;
    return prea < preb ? -1 : 1;
  }
}

async function fetchJson(url, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** 查询官方最新版本（按 registry 顺序回退）。 */
async function latestDshVersion() {
  for (const registry of DEFAULT_REGISTRIES) {
    try {
      const data = await fetchJson(`${registry}/@deepseek-ai/dsh/latest`);
      if (data && typeof data.version === "string") return { version: data.version, registry };
    } catch (err) {
      log(`registry ${registry} failed: ${err.message}`);
    }
  }
  return null;
}

/** 执行更新：用捆绑 Node 运行捆绑 npm 安装新版 dsh。 */
function runNpmInstall(version, registry, onProgress) {
  return new Promise((resolve) => {
    log(`npm install @deepseek-ai/dsh@${version} --registry ${registry}`);
    const child = spawn(NODE_EXE, [
      NPM_CLI,
      "install",
      `@deepseek-ai/dsh@${version}`,
      "--save",
      "--no-audit",
      "--no-fund",
      `--registry=${registry}`,
    ], {
      cwd: RUNTIME_DIR,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let tail = "";
    child.stdout.on("data", (c) => {
      const text = c.toString();
      log(`[npm] ${text.trim()}`);
      if (onProgress) onProgress(text);
    });
    child.stderr.on("data", (c) => {
      const text = c.toString();
      log(`[npm:err] ${text.trim()}`);
      tail = (tail + text).slice(-4000);
    });
    child.on("close", (code) => resolve({ code, tail }));
  });
}

/** 向窗口安全发送状态（窗口可能已销毁）。 */
function sendStatus(win, payload) {
  try {
    if (win && !win.isDestroyed()) win.webContents.send("dsh:update-status", payload);
  } catch { /* ignore */ }
}

/** 向窗口发送更新弹窗事件（自绘弹窗，非原生）。 */
function sendEvent(win, payload) {
  try {
    if (win && !win.isDestroyed()) win.webContents.send("dsh:update-event", payload);
  } catch { /* ignore */ }
}

/** 等待用户在更新弹窗中的操作；窗口关闭时返回 "cancel"。 */
function waitForUpdateAction(win) {
  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      ipcMain.removeListener("dsh:update-action", onAction);
      if (!win.isDestroyed()) win.removeListener("closed", onClosed);
    };
    const done = (action) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(action);
    };
    const onAction = (event, action) => {
      if (BrowserWindow.fromWebContents(event.sender) !== win) return;
      done(typeof action === "string" ? action : "cancel");
    };
    const onClosed = () => done("cancel");
    ipcMain.on("dsh:update-action", onAction);
    if (!win.isDestroyed()) win.once("closed", onClosed);
  });
}

/** 等待页面（重新）加载后 preload 上报就绪，避免事件比监听器先到。 */
function waitForRendererReady(win) {
  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      ipcMain.removeListener("dsh:renderer-ready", onReady);
      if (!win.isDestroyed()) win.removeListener("closed", onClosed);
    };
    const done = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };
    const onReady = (event) => {
      if (BrowserWindow.fromWebContents(event.sender) !== win) return;
      done();
    };
    const onClosed = () => done();
    ipcMain.on("dsh:renderer-ready", onReady);
    if (!win.isDestroyed()) win.once("closed", onClosed);
  });
}

/** 尽力拉取更新说明：优先 GitHub Releases 更新日志，其次 npm 包 README 简介片段（拿不到返回 null）。 */
async function fetchChangelog() {
  // 1) GitHub Releases 更新日志
  try {
    const data = await fetchJson(
      "https://api.github.com/repos/deepseek-ai/deepseek-harness/releases/latest",
      8000
    );
    if (data && typeof data.tag_name === "string" && typeof data.body === "string" && data.body.trim() !== "") {
      return { source: "GitHub Releases", tag: data.tag_name, body: data.body.slice(0, 1600) };
    }
  } catch (err) {
    log(`changelog(github) failed: ${err.message}`);
  }
  // 2) npm 包 README 简介（截取正文片段）
  for (const registry of DEFAULT_REGISTRIES) {
    try {
      const data = await fetchJson(`${registry}/@deepseek-ai/dsh`, 8000);
      if (data && typeof data.readme === "string" && data.readme.trim() !== "") {
        const text = data.readme
          .replace(/```[a-z]*/gi, "")
          .replace(/[#>*_`-]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (text.length > 0) return { source: "npm 包简介", tag: `v${data["dist-tags"]?.latest ?? ""}`.trim(), body: text.slice(0, 700) };
      }
    } catch (err) {
      log(`changelog(npm) failed: ${err.message}`);
    }
  }
  return null;
}

/**
 * 检查/执行更新（自绘弹窗驱动，主进程只等用户操作）。
 * @param win 窗口
 * @param opts.silent true=静默（只更新按钮状态，不弹窗；用于启动时自动检查）
 */
async function performUpdate(win, { silent = false } = {}) {
  if (updating) return;
  updating = true;
  try {
    const current = bundledDshVersion();

    // ---- 检查阶段（失败可重试） ----
    let latest = null;
    while (true) {
      if (silent) sendStatus(win, { state: "checking", current });
      else sendEvent(win, { type: "checking", current });
      latest = await latestDshVersion();
      log(`update check: current=${current} latest=${latest ? latest.version : "N/A"} silent=${silent}`);
      if (latest !== null) break;
      sendStatus(win, { state: "idle", current });
      if (silent) return;
      sendEvent(win, {
        type: "check-failed",
        current,
        detail: "无法连接到更新源（registry.npmmirror.com / registry.npmjs.org），请检查网络后重试。",
      });
      const action = await waitForUpdateAction(win);
      if (action !== "retry-check") {
        sendEvent(win, { type: "close" });
        return;
      }
    }

    if (compareVersions(latest.version, current) <= 0) {
      sendStatus(win, { state: "idle", current });
      if (silent) return;
      sendEvent(win, { type: "up-to-date", current, latest: latest.version });
      await waitForUpdateAction(win);
      sendEvent(win, { type: "close" });
      return;
    }

    // 有更新：先通知按钮切换为绿色箭头；静默模式到此为止
    sendStatus(win, { state: "available", current, latest: latest.version });
    if (silent) return;

    // 打开确认弹窗；更新说明异步拉取后填充
    sendEvent(win, { type: "available", current, latest: latest.version, changelog: null });
    fetchChangelog()
      .then((cl) => { if (cl) sendEvent(win, { type: "available-changelog", changelog: cl }); })
      .catch((err) => log(`changelog failed: ${err.message}`));

    const firstAction = await waitForUpdateAction(win);
    if (firstAction !== "confirm") {
      sendEvent(win, { type: "close" });
      return;
    }

    // ---- 安装阶段（失败可重试） ----
    while (true) {
      sendStatus(win, { state: "updating", current, latest: latest.version });
      sendEvent(win, { type: "updating", current, latest: latest.version });
      // 更新期间先停止服务器：Windows 下正在运行的原生模块文件会被锁定，
      // 不停服直接替换 node_modules 会导致 npm 安装失败。
      killServerTree();
      const result = await runNpmInstall(latest.version, latest.registry, () => {
        sendStatus(win, { state: "updating", current, latest: latest.version });
        sendEvent(win, { type: "updating", current, latest: latest.version });
      });
      if (result.code === 0) break;
      // 失败：用旧版本重启服务器，恢复可用状态；弹窗提示（不刷新页面，避免丢失弹窗）
      try {
        await startServer();
      } catch { /* ignore */ }
      sendStatus(win, { state: "idle", current });
      sendEvent(win, {
        type: "update-failed",
        current,
        latest: latest.version,
        detail: `npm 安装失败（退出码 ${result.code}）。\n${result.tail.slice(-700)}`,
      });
      const action = await waitForUpdateAction(win);
      if (action !== "retry") {
        sendEvent(win, { type: "close" });
        // 关闭后刷新页面，重新连接已恢复的服务器
        if (!win.isDestroyed()) win.loadURL(win.webContents.getURL());
        return;
      }
    }

    // ---- 成功：重启服务器即切换到新版本，无需重启整个应用 ----
    const newPort = await startServer();
    if (newPort === null) {
      sendEvent(win, { type: "update-failed", current, latest: latest.version, detail: "更新成功，但服务器重启失败，请手动重启应用。" });
      await waitForUpdateAction(win);
      sendEvent(win, { type: "close" });
      app.exit(1);
      return;
    }
    sendStatus(win, { state: "idle", current: latest.version });
    // 先挂等就绪监听，再刷新页面连接新服务器，等 preload 就绪后弹成功窗
    const ready = waitForRendererReady(win);
    if (!win.isDestroyed()) win.loadURL(`http://127.0.0.1:${newPort}`);
    await ready;
    sendEvent(win, { type: "success", current, latest: latest.version });
    await waitForUpdateAction(win);
    sendEvent(win, { type: "close" });
  } finally {
    updating = false;
  }
}

// ---------- 窗口 ----------
function createWindow(url) {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 620,
    show: true,
    title: APP_NAME,
    backgroundColor: "#00000000",
    // 窗体标头：隐藏系统标题栏，使用毛玻璃半透明（Windows 11 acrylic；Win10 由页面内 backdrop-filter 兜底）
    titleBarStyle: "hidden",
    backgroundMaterial: process.platform === "win32" ? "acrylic" : "none",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
    },
  });

  // 窗口立即显示：加载期间以毛玻璃背景呈现，页面就绪后由 DSH 自带加载动画接管

  win.on("maximize", () => win.webContents.send("dsh:win-maximized", true));
  win.on("unmaximize", () => win.webContents.send("dsh:win-maximized", false));
  win.on("closed", () => {
    if (!quitting) {
      quitting = true;
      killServerTree();
      app.quit();
    }
  });

  win.webContents.setWindowOpenHandler(({ url: target }) => {
    if (/^https?:/i.test(target)) shell.openExternal(target);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, target) => {
    // 只允许站内导航（本地服务器），外部链接一律交给系统浏览器
    const allowed = new URL(target);
    if (allowed.origin !== new URL(win.webContents.getURL()).origin) {
      event.preventDefault();
      if (/^https?:/i.test(target)) shell.openExternal(target);
    }
  });

  win.loadURL(url);
  return win;
}

// ---------- IPC ----------
function registerIpc() {
  ipcMain.on("dsh:win-min", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize();
  });
  ipcMain.on("dsh:win-max-toggle", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  });
  ipcMain.on("dsh:win-close", (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
  ipcMain.handle("dsh:win-is-maximized", (event) => {
    return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
  });
  ipcMain.on("dsh:check-update", (event, silent) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) performUpdate(win, { silent: !!silent });
  });
  ipcMain.handle("dsh:get-version", () => ({
    dsh: bundledDshVersion(),
    electron: process.versions.electron,
    node: process.versions.node,
    runtime: RUNTIME_DIR,
  }));
}

// ---------- 生命周期 ----------
app.setAppUserModelId("com.deepseekai.harness.desktop");

if (app.isPackaged) {
  // 打包版去掉默认应用菜单：避免误触 Ctrl+R / Ctrl+W 等快捷键，界面更干净
  try {
    const { Menu } = require("electron");
    Menu.setApplicationMenu(null);
  } catch { /* ignore */ }
}

app.whenReady().then(async () => {
  registerIpc();
  log(`========== ${APP_NAME} start ==========`);
  log(`dev=${isDev} runtime=${RUNTIME_DIR}`);

  // 运行时自检：node / dsh bin 必须存在
  const missing = [NODE_EXE, DSH_BIN, NPM_CLI].filter((f) => !fs.existsSync(f));
  if (missing.length > 0) {
    dialog.showErrorBox(
      APP_NAME,
      `运行时文件缺失：\n${missing.join("\n")}\n\n软件包可能不完整，请重新安装。`
    );
    app.exit(1);
    return;
  }
  log(`bundled dsh version: ${bundledDshVersion()}`);

  const port = await startServer();
  if (port === null) return;
  const url = `http://127.0.0.1:${port}`;
  log(`GUI ready at ${url}`);
  const win = createWindow(url);

  // 启动后静默检查一次更新：等页面 preload 上报就绪后再触发，
  // 避免页面还在加载、状态事件丢失导致按钮停留在错误状态。
  const autoCheck = () => {
    performUpdate(win, { silent: true }).catch((err) => log(`auto-check failed: ${err.message}`));
  };
  const onReadyForCheck = (event) => {
    if (BrowserWindow.fromWebContents(event.sender) !== win) return;
    ipcMain.removeListener("dsh:renderer-ready", onReadyForCheck);
    // 页面就绪后再稍等片刻，让界面稳定
    setTimeout(autoCheck, 1200);
  };
  ipcMain.on("dsh:renderer-ready", onReadyForCheck);
});

app.on("window-all-closed", () => {
  quitting = true;
  killServerTree();
  app.quit();
});

app.on("before-quit", () => {
  quitting = true;
  killServerTree();
});

process.on("uncaughtException", (err) => {
  log(`uncaughtException: ${err && err.stack ? err.stack : String(err)}`);
});
