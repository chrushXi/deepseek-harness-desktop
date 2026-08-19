"use strict";

/**
 * DeepSeek Harness Desktop —— Electron main process.
 *
 * 职责：
 *  1. 启动时先检测本机 Node / npm / npx / dsh，再决定是直接使用本机环境还是自动下载运行时；
 *  2. 等待服务器就绪后，用毛玻璃半透明窗体加载本地 GUI（界面与 web 版完全一致）；
 *  3. 自绘标题栏（拖拽区 + 最小化/最大化/关闭 + 一键更新按钮）；
 *  4. 通过官方 npx 命令（npmmirror，可回退 npmjs）下载、启动和更新 dsh。
 */

const { app, BrowserWindow, dialog, ipcMain, shell, nativeTheme } = require("electron");
const { spawn, execFile } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");
const { pathToFileURL } = require("node:url");

const APP_NAME = "DeepSeek Harness";
const SERVER_READY_TIMEOUT_MS = 60_000;
const POLL_INTERVAL_MS = 300;
/** 更新源：优先环境变量 DSH_UPDATE_REGISTRY（可指向内网镜像），否则官方镜像 + npmjs 回退 */
const DEFAULT_REGISTRIES = [
  process.env.DSH_UPDATE_REGISTRY,
  "https://registry.npmmirror.com",
  "https://registry.npmjs.org",
].filter(Boolean);
/** 首次运行联网安装用的 Node 版本与国内镜像（npmmirror，失败回退官方源）。 */
const NODE_VERSION = "v24.14.1";
const NODE_DOWNLOAD_URLS = [
  process.env.DSH_NODE_MIRROR,
  `https://npmmirror.com/mirrors/node/${NODE_VERSION}/node-${NODE_VERSION}-win-x64.zip`,
  `https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-win-x64.zip`,
].filter(Boolean);
const DSH_INSTALL_VERSION = "0.1.0-rc.7";
const DSH_MIN_RUNTIME_NODE_MAJOR = 24;

// ---------- 路径 ----------
const isDev = !app.isPackaged;
/** 运行时根目录：首次运行时可由用户选择安装位置；默认装在软件安装目录下（dev 用项目 runtime/） */
let RUNTIME_DIR = isDev ? path.join(__dirname, "runtime") : null;
const INTERNAL_DIR = isDev
  ? path.join(__dirname, "internal")
  : path.join(process.resourcesPath, "internal");

let NODE_EXE = null;
let NPM_CLI = null;
let NPX_CLI = null;
let runtimeMode = "bundled";
let nativeRuntime = null;
let dshLaunchVersion = DSH_INSTALL_VERSION;
function setRuntimeDir(dir) {
  RUNTIME_DIR = dir;
  NODE_EXE = path.join(dir, "node.exe");
  NPM_CLI = path.join(dir, "node_modules", "npm", "bin", "npm-cli.js");
  NPX_CLI = path.join(dir, "node_modules", "npm", "bin", "npx-cli.js");
}
function hasHealthyNpmRuntime() {
  return fs.existsSync(NPM_CLI)
    && fs.existsSync(NPX_CLI)
    && fs.existsSync(path.join(RUNTIME_DIR, "node_modules", "npm", "package.json"));
}
function hasHealthyAppRuntime() {
  return fs.existsSync(NODE_EXE) && hasHealthyNpmRuntime();
}
function npxCacheDir() {
  return path.join(RUNTIME_DIR, "npm-cache");
}
function setRuntimeMode(mode) {
  runtimeMode = mode === "native" || mode === "local-node" || mode === "global" ? mode : "bundled";
}
/** 默认运行时安装位置：软件安装目录下的 runtime/（开发模式用项目 runtime/）。 */
function defaultRuntimeDir() {
  if (isDev) return path.join(__dirname, "runtime");
  try {
    // app.getAppPath() = <安装目录>/resources/app.asar
    const installDir = path.dirname(path.dirname(app.getAppPath()));
    return path.join(installDir, "runtime");
  } catch {
    return path.join(app.getPath("userData"), "runtime");
  }
}
function globalRuntimeDir() {
  return path.join(app.getPath("userData"), "global-node");
}
function normalizeNodeVersion(text) {
  const value = String(text ?? "").trim();
  const match = value.match(/^v?(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
  if (!match) return null;
  return {
    raw: value,
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}
function execVersion(exe, args) {
  return new Promise((resolve) => {
    execFile(exe, args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        resolve(null);
        return;
      }
      const text = String(stdout || stderr || "");
      resolve(text.trim());
    });
  });
}
function firstLine(text) {
  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line !== "") ?? null;
}
function preferredWherePath(text) {
  const lines = String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== "");
  return lines.find((line) => /\.(cmd|exe|bat|ps1)$/i.test(line)) ?? lines[0] ?? null;
}
function readPackageVersion(file) {
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return typeof data.version === "string" && data.version.trim() !== "" ? data.version.trim() : null;
  } catch {
    return null;
  }
}

async function probeNodeToolchain() {
  const [nodeVersionText, npmVersionText, npxVersionText, npmPrefixText, npmRootText, nodePathText, npmPathText, npxPathText] = await Promise.all([
    execVersion("node", ["--version"]),
    execVersion("npm", ["--version"]),
    execVersion("npx", ["--version"]),
    execVersion("npm", ["prefix", "-g"]),
    execVersion("npm", ["root", "-g"]),
    execVersion("where.exe", ["node"]),
    execVersion("where.exe", ["npm"]),
    execVersion("where.exe", ["npx"]),
  ]);
  const node = normalizeNodeVersion(nodeVersionText);
  const npm = normalizeNodeVersion(npmVersionText);
  const npx = normalizeNodeVersion(npxVersionText);
  const nodePath = preferredWherePath(nodePathText);
  const npmPath = preferredWherePath(npmPathText);
  const npxPath = preferredWherePath(npxPathText);
  const npmPrefix = firstLine(npmPrefixText);
  const npmRoot = firstLine(npmRootText);
  const nodeOk = node !== null;
  const nodeCompatible = node !== null && node.major >= DSH_MIN_RUNTIME_NODE_MAJOR;
  const npmOk = npm !== null;
  const npxOk = npx !== null;
  return {
    node: node ? { ...node, ok: nodeOk, compatible: nodeCompatible } : null,
    nodePath,
    npm: npm ? { ...npm, ok: npmOk } : null,
    npmPath,
    npx: npx ? { ...npx, ok: npxOk } : null,
    npxPath,
    npmPrefix,
    npmRoot,
    nodeCompatible,
    localNodeReady: nodeOk && npmOk && npxOk,
  };
}

async function probeDshToolchain(base = null) {
  const nodeProbe = base || await probeNodeToolchain();
  const [dshPathText, dshVersionText] = await Promise.all([
    execVersion("where.exe", ["dsh"]),
    execVersion("dsh", ["--version"]),
  ]);
  const dshPathFromWhere = preferredWherePath(dshPathText);
  const globalBinCandidates = [];
  if (nodeProbe.npmPrefix) {
    globalBinCandidates.push(
      path.join(nodeProbe.npmPrefix, "dsh.cmd"),
      path.join(nodeProbe.npmPrefix, "dsh"),
      path.join(nodeProbe.npmPrefix, "dsh.ps1"),
      path.join(nodeProbe.npmPrefix, "node_modules", ".bin", "dsh.cmd"),
      path.join(nodeProbe.npmPrefix, "node_modules", ".bin", "dsh"),
      path.join(nodeProbe.npmPrefix, "node_modules", ".bin", "dsh.ps1"),
    );
  }
  let dshPath = dshPathFromWhere;
  if (!dshPath) {
    dshPath = globalBinCandidates.find((candidate) => {
      try {
        return fs.existsSync(candidate);
      } catch {
        return false;
      }
    }) || null;
  }
  let dshVersion = dshVersionText ? String(dshVersionText).trim() : null;
  if (!dshVersion && nodeProbe.npmRoot) {
    const pkgJsonCandidates = [
      path.join(nodeProbe.npmRoot, "@deepseek-ai", "dsh", "package.json"),
      path.join(nodeProbe.npmRoot, "dsh", "package.json"),
      ...(nodeProbe.npmPrefix ? [
        path.join(nodeProbe.npmPrefix, "node_modules", "@deepseek-ai", "dsh", "package.json"),
        path.join(nodeProbe.npmPrefix, "node_modules", "dsh", "package.json"),
      ] : []),
    ];
    const pkgJson = pkgJsonCandidates.find((candidate) => {
      try {
        return fs.existsSync(candidate);
      } catch {
        return false;
      }
    }) || null;
    if (pkgJson) {
      dshVersion = readPackageVersion(pkgJson);
    }
  }
  const dsh = dshVersion || dshPath ? { raw: dshVersion || dshPath || "installed" } : null;
  const dshOk = dsh !== null || dshPath !== null;
  return {
    ...nodeProbe,
    dsh: dsh ? { ...dsh, ok: dshOk } : null,
    dshPath,
    installed: nodeProbe.nodeCompatible && !!nodeProbe.npm && !!nodeProbe.npx && dshOk,
  };
}

async function detectNativeRuntime() {
  return probeDshToolchain(await probeNodeToolchain());
}

async function probeNetworkSource() {
  let lastError = null;
  for (const registry of DEFAULT_REGISTRIES) {
    try {
      await fetchJson(`${registry}/@deepseek-ai/dsh/latest`, 4500);
      return { ok: true, registry };
    } catch (error) {
      lastError = error;
    }
  }
  return {
    ok: false,
    registry: null,
    detail: lastError && lastError.message ? lastError.message : "无法连接下载源",
  };
}
/** Desktop-bundled damage monitor layer; mounted automatically for every web boot. */
const DAMAGE_PULSE_PATCH = path.join(INTERNAL_DIR, "damage-pulse", "cordis.patch.yml");
const DAMAGE_PULSE_MODULE = path.join(INTERNAL_DIR, "damage-pulse");

// ---------- 启动画面主题（跟随应用主题，持久化；首次运行跟随系统深浅色） ----------
const THEME_FILE = () => path.join(app.getPath("userData"), "theme.json");
const BOOT_FILE = () => path.join(app.getPath("userData"), "boot.json");
let splashTheme = "dark";
function loadSplashTheme() {
  try {
    const parsed = JSON.parse(fs.readFileSync(THEME_FILE(), "utf8"));
    if (parsed && (parsed.theme === "light" || parsed.theme === "dark")) {
      splashTheme = parsed.theme;
      return;
    }
  } catch { /* 首次运行 */ }
  splashTheme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
}
function saveSplashTheme(theme) {
  try {
    fs.mkdirSync(path.dirname(THEME_FILE()), { recursive: true });
    fs.writeFileSync(THEME_FILE(), `${JSON.stringify({ theme }, null, 2)}\n`);
  } catch { /* ignore */ }
}
function loadBootChoice() {
  try {
    const parsed = JSON.parse(fs.readFileSync(BOOT_FILE(), "utf8"));
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.mode !== "native" && parsed.mode !== "local-node" && parsed.mode !== "bundled" && parsed.mode !== "global") return null;
    return {
      mode: parsed.mode,
      runtimeDir: typeof parsed.runtimeDir === "string" && parsed.runtimeDir.trim() !== "" ? parsed.runtimeDir.trim() : null,
      dshVersion: typeof parsed.dshVersion === "string" && parsed.dshVersion.trim() !== "" ? parsed.dshVersion.trim() : null,
    };
  } catch {
    return null;
  }
}
function saveBootChoice(choice) {
  try {
    fs.mkdirSync(path.dirname(BOOT_FILE()), { recursive: true });
    fs.writeFileSync(BOOT_FILE(), `${JSON.stringify(choice, null, 2)}\n`);
  } catch { /* ignore */ }
}

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
function bundledDshVersion() {
  if (runtimeMode === "native") {
    const nativeVersion = nativeRuntime && nativeRuntime.dsh && typeof nativeRuntime.dsh.raw === "string"
      ? nativeRuntime.dsh.raw.trim()
      : "";
    return nativeVersion !== "" ? nativeVersion : "native";
  }
  return dshLaunchVersion;
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
const bootPayloadCache = new WeakMap();

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

// ---------- 启动画面（Boot Splash） ----------

/** 向窗口推送启动状态：{ installing?, stage, percent }。 */
function sendBoot(win, payload) {
  try {
    if (!win || win.isDestroyed()) return;
    bootPayloadCache.set(win, payload);
    win.webContents.send("dsh:boot-progress", payload);
  } catch { /* ignore */ }
}

/** 向窗口追加一条安装日志。 */
function sendBootLog(win, line) {
  try {
    if (win && !win.isDestroyed()) win.webContents.send("dsh:boot-log", { line: String(line) });
  } catch { /* ignore */ }
}

function detectStep(label, state, detail = "") {
  return {
    label,
    state,
    detail,
  };
}

function nodeStepDetail(nodeProbe) {
  if (!nodeProbe || !nodeProbe.node) return "未检测到 Node";
  const pieces = [nodeProbe.node.raw];
  if (nodeProbe.npm) pieces.push(`npm ${nodeProbe.npm.raw}`);
  if (nodeProbe.npx) pieces.push(`npx ${nodeProbe.npx.raw}`);
  return pieces.join(" · ");
}

function dshStepDetail(dshProbe) {
  if (!dshProbe || !dshProbe.dsh) return "未检测到 DeepSeek Harness";
  return dshProbe.dsh.raw;
}

function networkStepDetail(networkProbe) {
  if (!networkProbe) return "正在检查下载源";
  if (networkProbe.ok) {
    return `可连接 ${networkProbe.registry.replace(/^https?:\/\//i, "")}`;
  }
  return networkProbe.detail || "无法连接下载源";
}

function startupBranch(nativeRuntime) {
  if (nativeRuntime && nativeRuntime.installed && nativeRuntime.dshPath) return "native";
  return "global";
}

function installBranch(nativeRuntime) {
  return "global";
}

function installBranchTitle(mode) {
  if (mode === "local-node") return "将使用本机 Node 安装 DeepSeek Harness";
  return "将先下载 Node，再安装 DeepSeek Harness";
}

function readyStageText(mode) {
  if (mode === "native") return "本机环境已就绪，点击开始使用";
  if (mode === "global") return "全局安装完成，点击开始使用";
  if (mode === "local-node") return "安装完成，可以开始使用";
  return "安装完成，可以开始使用";
}

async function runStartupWizard(win) {
  if (!win || win.isDestroyed()) return;
  sendBoot(win, {
    page: "detect",
    stage: "正在检测环境…",
    detectComplete: false,
    native: null,
    network: null,
    installMode: "bundled",
    steps: [
      detectStep("检测 Node.js 环境", "loading", "正在检查 Node.js、npm、npx"),
      detectStep("检测 DeepSeek Harness 环境", "idle", "等待上一步完成"),
      detectStep("检测当前网络状态", "idle", "等待上一步完成"),
    ],
  });

  const nodeProbe = await probeNodeToolchain();
  if (!win || win.isDestroyed()) return;
  sendBoot(win, {
    page: "detect",
    stage: "正在检测 DeepSeek Harness 环境…",
    detectComplete: false,
    native: {
      ...nodeProbe,
      dsh: null,
      dshPath: null,
      installed: false,
    },
    network: null,
    installMode: startupBranch({ ...nodeProbe, dsh: null, dshPath: null, installed: false }),
    steps: [
      detectStep("检测 Node.js 环境", nodeProbe.node ? "success" : "fail", nodeStepDetail(nodeProbe)),
      detectStep("检测 DeepSeek Harness 环境", "loading", "正在检查 dsh"),
      detectStep("检测当前网络状态", "idle", "等待上一步完成"),
    ],
  });

  const nativeProbe = await probeDshToolchain(nodeProbe);
  if (!win || win.isDestroyed()) return;
  sendBoot(win, {
    page: "detect",
    stage: "正在检测当前网络状态…",
    detectComplete: false,
    native: nativeProbe,
    network: null,
    installMode: startupBranch(nativeProbe),
    steps: [
      detectStep("检测 Node.js 环境", nativeProbe.node ? "success" : "fail", nodeStepDetail(nativeProbe)),
      detectStep("检测 DeepSeek Harness 环境", nativeProbe.dsh ? "success" : "fail", dshStepDetail(nativeProbe)),
      detectStep("检测当前网络状态", "loading", "正在检查下载源"),
    ],
  });

  const networkProbe = await probeNetworkSource();
  if (!win || win.isDestroyed()) return;
  const branch = startupBranch(nativeProbe);
  sendBoot(win, {
    page: "detect",
    stage: "检测完成",
    detectComplete: true,
    native: nativeProbe,
    network: networkProbe,
    installMode: branch,
    nextPage: nativeProbe.installed ? "confirm" : "install",
    steps: [
      detectStep("检测 Node.js 环境", nativeProbe.node ? "success" : "fail", nodeStepDetail(nativeProbe)),
      detectStep("检测 DeepSeek Harness 环境", nativeProbe.dsh ? "success" : "fail", dshStepDetail(nativeProbe)),
      detectStep("检测当前网络状态", networkProbe.ok ? "success" : "fail", networkStepDetail(networkProbe)),
    ],
  });
}

/** 带进度与重定向跟随的 HTTP(S) 下载。 */
function downloadFile(url, dest, onProgress) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        downloadFile(res.headers.location, dest, onProgress).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const total = Number(res.headers["content-length"]) || 0;
      let received = 0;
      const file = fs.createWriteStream(dest);
      res.on("data", (chunk) => {
        received += chunk.length;
        file.write(chunk);
        if (total > 0) onProgress(received / total, received, total);
      });
      res.on("end", () => file.end());
      file.on("finish", () => file.close(() => resolve()));
      file.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(30_000, () => req.destroy(new Error("下载超时")));
  });
}

/** 用系统 tar（Windows 自带 bsdtar）解压 zip。 */
function extractZip(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    execFile("tar", ["-xf", zipPath, "-C", destDir], { windowsHide: true }, (error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

/**
 * 通过官方 npx 路径预取 dsh。包被隔离在运行时自己的 npm 缓存中，Node/npm
 * 本体保持只读，因此安装中断不会让下次启动误判为“安装到一半”。
 */
function warmDshWithNpx(win, version = dshLaunchVersion, registry = DEFAULT_REGISTRIES[0] ?? "https://registry.npmmirror.com") {
  return new Promise((resolve) => {
    if (!hasHealthyAppRuntime()) {
      resolve(false);
      return;
    }
    const packageSpec = version ? `@deepseek-ai/dsh@${version}` : "@deepseek-ai/dsh";
    sendBoot(win, { page: "installing", installing: true, stage: "正在下载 DeepSeek Harness…", percent: 60 });
    sendBootLog(win, `npx ${packageSpec} --version`);
    const child = spawn(NODE_EXE, [
      NPX_CLI,
      "--yes",
      `--registry=${registry}`,
      "--loglevel=info",
      packageSpec,
      "--version",
    ], {
      cwd: RUNTIME_DIR,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        npm_config_cache: npxCacheDir(),
        npm_config_update_notifier: "false",
      },
    });
    let tail = "";
    let progress = 60;
    const creep = setInterval(() => {
      progress = Math.min(90, progress + 1);
      sendBoot(win, { page: "installing", installing: true, stage: "正在下载 DeepSeek Harness…", percent: progress });
    }, 900);
    const write = (chunk) => {
      const text = chunk.toString();
      tail = (tail + text).slice(-4000);
      for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.replace(/\r/g, "").trim();
        if (line) sendBootLog(win, line);
      }
    };
    child.stdout.on("data", write);
    child.stderr.on("data", write);
    const timer = setTimeout(() => {
      try { child.kill(); } catch { /* ignore */ }
    }, 15 * 60_000);
    child.on("error", () => {
      clearTimeout(timer);
      clearInterval(creep);
      resolve(false);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      clearInterval(creep);
      if (code !== 0) {
        sendBootLog(win, `dsh 下载失败（退出码 ${code}）：${tail.slice(-600)}`);
        resolve(false);
        return;
      }
      sendBoot(win, { page: "installing", installing: true, stage: "DeepSeek Harness 已就绪…", percent: 92 });
      sendBootLog(win, "DeepSeek Harness 已通过官方 npx 准备完成");
      resolve(true);
    });
  });
}

async function ensurePortableRuntime(win) {
  if (hasHealthyAppRuntime()) return warmDshWithNpx(win);
  sendBoot(win, {
    page: "installing",
    installing: true,
    stage: "正在下载独立运行时…",
    percent: 1,
  });
  fs.mkdirSync(RUNTIME_DIR, { recursive: true });
  try {
    // Node 自带 npm 已满足本应用需求。若 npm 文件不完整，重新解压整套 Node，
    // 不能让损坏的 npm 进程再覆盖自身，否则会永久卡在安装阶段。
    if (!fs.existsSync(NODE_EXE) || !hasHealthyNpmRuntime()) {
      if (fs.existsSync(NODE_EXE)) {
        sendBootLog(win, "检测到 npm 运行时不完整，正在重建 Node.js 环境");
      }
      const zipPath = path.join(RUNTIME_DIR, `node-${NODE_VERSION}-win-x64.zip`);
      let lastError = null;
      for (const mirror of NODE_DOWNLOAD_URLS) {
        try {
          sendBoot(win, { page: "installing", installing: true, stage: `正在下载 Node.js ${NODE_VERSION}…`, percent: 2 });
          const started = Date.now();
          let lastLogPct = -1;
          await downloadFile(mirror, zipPath, (fraction, received) => {
            const wholePct = Math.round(fraction * 100);
            sendBoot(win, { page: "installing", installing: true, stage: `正在下载 Node.js（${wholePct}%）…`, percent: 2 + Math.round(fraction * 36) });
            if (wholePct !== lastLogPct) {
              lastLogPct = wholePct;
              sendBootLog(win, `正在下载 Node.js ${NODE_VERSION} … ${Math.max(0, Math.round(received / 1e6))} MB（${wholePct}%）`);
            }
          });
          sendBootLog(win, `Node.js ${NODE_VERSION} 下载完成（${Math.round((Date.now() - started) / 1000)}s）`);
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          sendBootLog(win, `下载源 ${mirror} 失败：${error.message}，尝试下一个…`);
        }
      }
      if (lastError !== null) throw lastError;
      sendBoot(win, { page: "installing", installing: true, stage: "正在解压 Node 运行时…", percent: 42 });
      await extractZip(zipPath, RUNTIME_DIR);
      const extractedDir = path.join(RUNTIME_DIR, `node-${NODE_VERSION}-win-x64`);
      if (fs.existsSync(extractedDir)) {
        for (const entry of fs.readdirSync(extractedDir)) {
          const from = path.join(extractedDir, entry);
          const to = path.join(RUNTIME_DIR, entry);
          if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
          fs.renameSync(from, to);
        }
        fs.rmdirSync(extractedDir);
      }
      fs.rmSync(zipPath, { force: true });
      sendBootLog(win, `Node.js 已就绪：${NODE_EXE}`);
    }
    if (!hasHealthyNpmRuntime()) throw new Error("Node.js 自带 npm 未能正确恢复");
    // dsh 只交给官方 npx 缓存，不再写入 Node 的 node_modules。
    // 这样不会因 dsh 的依赖安装或更新中断而损坏 npm 自身。
    if (!(await warmDshWithNpx(win))) return false;
    sendBootLog(win, "运行时安装完成");
    return true;
  } catch (error) {
    sendBootLog(win, `运行时安装失败：${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function ensureLocalNodeRuntime(win) {
  return ensurePortableRuntime(win);
}

async function ensureGlobalRuntime(win) {
  // 默认运行时位于应用数据目录；dsh 使用官方 npx 缓存管理，不执行 npm -g。
  setRuntimeDir(globalRuntimeDir());
  setRuntimeMode("global");
  return ensurePortableRuntime(win);
}

async function ensureRuntime(win) {
  if (runtimeMode === "native") return true;
  if (runtimeMode === "global") return ensureGlobalRuntime(win);
  if (runtimeMode === "local-node") return ensureLocalNodeRuntime(win);
  return ensurePortableRuntime(win);
}

async function installAndBoot(win, mode) {
  setRuntimeMode(mode);
  const ok = await ensureRuntime(win);
  if (!ok) return false;
  await bootServer(win);
  return true;
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
  sendBoot(win, {
    page: "booting",
    installing: false,
    stage: runtimeMode === "native"
      ? "正在启动本机环境中的 DeepSeek Harness 服务…"
      : runtimeMode === "local-node"
        ? "正在启动本机 Node 环境中的 DeepSeek Harness 服务…"
        : "正在启动 DeepSeek Harness 服务…",
    percent: 93,
  });
  syncBundledDamagePulse();
  const logPath = SERVER_LOG();
  const launch = runtimeMode === "native" && nativeRuntime && typeof nativeRuntime.dshPath === "string" && nativeRuntime.dshPath !== ""
    ? {
        command: nativeRuntime.dshPath,
        args: ["web", "--patch", DAMAGE_PULSE_PATCH, "--port", "0"],
        cwd: app.getPath("userData"),
        shell: true,
      }
    : {
        command: NODE_EXE,
        args: [
          NPX_CLI,
          "--yes",
          `--registry=${DEFAULT_REGISTRIES[0] ?? "https://registry.npmmirror.com"}`,
          `@deepseek-ai/dsh@${dshLaunchVersion}`,
          "web",
          "--patch", DAMAGE_PULSE_PATCH,
          "--port", "0",
        ],
        cwd: RUNTIME_DIR,
      };
  log(`starting server: ${launch.command} ${launch.args.join(" ")}`);
  const child = spawn(launch.command, launch.args, {
    cwd: launch.cwd,
    env: {
      ...process.env,
      DSH_TELEMETRY_DISABLED: process.env.DSH_TELEMETRY_DISABLED || "",
      npm_config_cache: npxCacheDir(),
      npm_config_update_notifier: "false",
    },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    shell: !!launch.shell,
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
      if (ok) {
        sendBoot(win, { page: "booting", installing: false, stage: "服务已就绪，正在加载界面…", percent: 100 });
        return port;
      }
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
  if (runtimeMode === "native") {
    if (!silent) {
      sendEvent(win, { type: "up-to-date", current: "native", latest: "native" });
    }
    return;
  }
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
      const prepared = await warmDshWithNpx(null, latest.version, latest.registry);
      if (prepared) {
        dshLaunchVersion = latest.version;
        if (runtimeMode !== "native") {
          saveBootChoice({ mode: runtimeMode, runtimeDir: RUNTIME_DIR, dshVersion: dshLaunchVersion });
        }
        break;
      }
      // 失败：用旧版本重启服务器，恢复可用状态；弹窗提示（不刷新页面，避免丢失弹窗）
      try {
        await startServer();
      } catch { /* ignore */ }
      sendStatus(win, { state: "idle", current });
      sendEvent(win, {
        type: "update-failed",
        current,
        latest: latest.version,
        detail: "通过官方 npx 下载 DeepSeek Harness 失败，请检查网络后重试。",
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
function createWindow(url, savedBoot = null) {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 620,
    // 先加载本地启动页，再显示窗口，避免先露出 Electron 空白边框或黑屏。
    show: false,
    title: APP_NAME,
    // 启动画面阶段用主题底色实底秒开（不启用毛玻璃，避免先出模糊窗）；进主界面前再开 acrylic
    backgroundColor: "#000000",
    // 窗体标头：隐藏系统标题栏，使用毛玻璃半透明（Windows 11 acrylic；Win10 由页面内 backdrop-filter 兜底）
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false,
      // 主题经启动参数同步注入启动页；已安装过 → 启动页直接进入“正在启动”视图
      additionalArguments: [
        `--dsh-splash-theme=${splashTheme}`,
        ...(savedBoot ? ["--dsh-boot-resume=1"] : []),
      ],
    },
  });

  let splashShown = false;
  const showSplash = () => {
    if (splashShown || win.isDestroyed()) return;
    splashShown = true;
    try { win.show(); } catch { /* ignore */ }
  };
  // 本地 splash.html 加载完成即显示，避免等待 ready-to-show 的额外延迟。
  win.webContents.once("did-finish-load", showSplash);
  // 主进程检测可能早于 preload 初始化，页面加载完成后重放最近一次启动状态。
  win.webContents.once("did-finish-load", () => {
    const cached = bootPayloadCache.get(win);
    if (cached) sendBoot(win, cached);
  });
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
    // dsh Web UI 偶尔会以 window.open 打开自身 URL；桌面端始终留在当前窗口，
    // 不能把本地服务交给系统默认浏览器。
    if (/^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/i.test(target)) {
      if (!win.isDestroyed()) win.loadURL(target);
      return { action: "deny" };
    }
    if (/^https?:/i.test(target)) shell.openExternal(target);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (event, target) => {
    const current = win.webContents.getURL();
    // 启动页（file://）→ 主界面：首次导航放行
    if (current === "about:blank" || current === "" || current.startsWith("file:")) return;
    // 只允许站内导航（本地服务器），外部链接一律交给系统浏览器
    const allowed = new URL(target);
    if (allowed.origin !== new URL(current).origin) {
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
    mode: runtimeMode,
    native: nativeRuntime ? {
      installed: nativeRuntime.installed,
      node: nativeRuntime.node ? nativeRuntime.node.raw : null,
      npm: nativeRuntime.npm ? nativeRuntime.npm.raw : null,
      npx: nativeRuntime.npx ? nativeRuntime.npx.raw : null,
      dsh: nativeRuntime.dsh ? nativeRuntime.dsh.raw : null,
    } : null,
  }));
  // 启动画面主题：主界面报告主题 → 持久化（供下次启动页跟随）并恢复毛玻璃透明底
  ipcMain.on("dsh:theme", (event, theme) => {
    if (theme === "light" || theme === "dark") {
      splashTheme = theme;
      saveSplashTheme(theme);
    }
    // 主界面已渲染出主题底色：此时再切透明+毛玻璃，不会出现白闪
    if (process.platform === "win32") {
      const win = BrowserWindow.fromWebContents(event.sender);
      try {
        if (win && !win.isDestroyed()) {
          win.setBackgroundMaterial("acrylic");
          win.setBackgroundColor("#00000000");
        }
      } catch { /* ignore */ }
    }
  });
  // 首次运行：让用户选择运行时安装位置（默认软件安装目录/runtime）
  ipcMain.handle("dsh:choose-runtime-dir", async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return null;
    const result = await dialog.showOpenDialog(win, {
      title: "选择运行时安装位置",
      buttonLabel: "选择此文件夹",
      defaultPath: RUNTIME_DIR,
      properties: ["openDirectory", "createDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return path.join(result.filePaths[0], "runtime");
  });
  ipcMain.on("dsh:runtime-install", async (event, dir) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return;
    const request = dir && typeof dir === "object" ? dir : { mode: "custom", dir };
    const requestedMode = request.mode === "global" ? "global" : "custom";
    // 安装版始终使用应用管理的 Node + npx；本机 Node 只在用户明确选择
    // “使用本机环境”且本机已经具备 dsh 时使用。
    const mode = requestedMode === "global" ? "global" : "bundled";
    if (requestedMode === "global") {
      try {
        const ok = await ensureGlobalRuntime(win);
        if (!ok) throw new Error("全局安装 dsh 失败");
        saveBootChoice({ mode: "global", runtimeDir: globalRuntimeDir(), dshVersion: dshLaunchVersion });
        sendBoot(win, { page: "ready", stage: readyStageText("global"), percent: 100, primaryAction: "start", installMode: "global", detectComplete: true });
      } catch (error) {
        sendBootLog(win, `全局安装失败：${error instanceof Error ? error.message : String(error)}`);
        sendBoot(win, { page: "installing", installing: false, installError: true, stage: "安装失败，请检查网络后重试", percent: 0, native: nativeRuntime, detectComplete: true, installMode: "global" });
      }
      return;
    }
    if (typeof request.dir !== "string" || request.dir.trim() === "") return;
    const target = path.resolve(request.dir.trim());
    setRuntimeMode(mode);
    try {
      fs.mkdirSync(target, { recursive: true });
    } catch (error) {
      sendBootLog(win, `无法创建目录：${error.message}`);
      sendBoot(win, { page: "location", installing: false, stage: "请选择程序的安装目录", percent: 0, defaultDir: RUNTIME_DIR, native: nativeRuntime, detectComplete: true });
      return;
    }
    setRuntimeDir(target);
    log(`runtime install target: ${target}`);
    try {
      const ok = await ensureRuntime(win);
      if (!ok) {
        sendBootLog(win, "安装失败，请更换安装位置或检查网络后重试");
        sendBoot(win, { page: "installing", installing: false, installError: true, stage: "安装失败，请检查网络后重试", percent: 0, defaultDir: RUNTIME_DIR, native: nativeRuntime, detectComplete: true, installMode: mode });
        return;
      }
      saveBootChoice({ mode, runtimeDir: target, dshVersion: dshLaunchVersion });
      sendBoot(win, {
        page: "ready",
        stage: readyStageText(mode),
        percent: 100,
        primaryAction: "start",
        installMode: mode,
        defaultDir: target,
        native: nativeRuntime,
        detectComplete: true,
      });
    } catch (error) {
      log(`runtime install flow error: ${error && error.message ? error.message : String(error)}`);
      sendBootLog(win, `安装异常：${error && error.message ? error.message : String(error)}`);
      sendBoot(win, { page: "installing", installing: false, installError: true, stage: "安装失败，请检查网络后重试", percent: 0, defaultDir: RUNTIME_DIR, native: nativeRuntime, detectComplete: true, installMode: mode });
    }
  });
  ipcMain.on("dsh:boot-choice", async (event, choice) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win || typeof choice !== "string") return;
    if (choice === "native") {
      if (!nativeRuntime || !nativeRuntime.installed || !nativeRuntime.dshPath) {
        sendBootLog(win, "本机环境检测结果不可用，请改用单独安装");
        sendBoot(win, { page: "detect", installing: false, stage: "未检测到可用本机环境", percent: 0, defaultDir: RUNTIME_DIR, native: nativeRuntime, detectComplete: true });
        return;
      }
      saveBootChoice({ mode: "native", runtimeDir: null });
      setRuntimeMode("native");
      sendBoot(win, {
        page: "ready",
        stage: readyStageText("native"),
        percent: 100,
        primaryAction: "start",
        installMode: "native",
      });
      return;
    }
    if (choice === "install") {
      const mode = installBranch(nativeRuntime);
      sendBoot(win, {
        page: "location",
        installing: false,
        stage: "请选择程序的安装目录",
        percent: 0,
        defaultDir: RUNTIME_DIR,
        native: nativeRuntime,
        detectComplete: true,
        installMode: mode,
      });
      return;
    }
    if (choice === "start") {
      try {
        if (runtimeMode === "native") {
          if (!nativeRuntime || !nativeRuntime.installed || !nativeRuntime.dshPath) {
            sendBootLog(win, "本机环境检测结果不可用，请改用单独安装");
            sendBoot(win, { page: "detect", installing: false, stage: "未检测到可用本机环境", percent: 0, defaultDir: RUNTIME_DIR, native: nativeRuntime, detectComplete: true });
            return;
          }
          log(`boot choice: native (${nativeRuntime.dshPath})`);
        }
        await bootServer(win);
      } catch (error) {
        log(`native boot failed: ${error && error.message ? error.message : String(error)}`);
        sendBootLog(win, `本机启动失败：${error && error.message ? error.message : String(error)}`);
        setRuntimeMode("bundled");
        sendBoot(win, { page: "detect", installing: false, stage: "正在检查本机环境…", percent: 0, defaultDir: RUNTIME_DIR, native: nativeRuntime, detectComplete: true });
      }
    }
  });
}

// ---------- 生命周期 ----------
app.setAppUserModelId("com.deepseekai.harness.desktop");
// Windows 下禁用原生窗口遮挡检测：该检测会延迟窗口首帧显示（黑屏/慢出），禁用可加快启动
app.commandLine.appendSwitch("disable-features", "CalculateNativeWinOcclusion");

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
  log(`dev=${isDev}`);
  loadSplashTheme();

  const savedBoot = loadBootChoice();
  if (savedBoot && savedBoot.dshVersion) dshLaunchVersion = savedBoot.dshVersion;
  setRuntimeDir(savedBoot && savedBoot.runtimeDir ? savedBoot.runtimeDir : defaultRuntimeDir());
  log(`runtime dir: ${RUNTIME_DIR}`);

  // 双击后立即开窗：启动页（logo/状态/进度条）马上渲染，检测等其余工作在后台并行
  const splashUrl = pathToFileURL(path.join(__dirname, "assets", "splash.html")).href;
  const win = createWindow(splashUrl, savedBoot);

  if (savedBoot) {
    // 已安装过：启动页直接进入“正在启动”视图（logo + 状态 + 进度条）
    sendBoot(win, { page: "booting", installing: false, stage: "正在准备环境…", percent: 5 });
  }

  // 已安装的应用管理运行时无需探测本机环境，直接起服务，启动最快。
  const skipDetection = !!savedBoot && (savedBoot.mode === "bundled" || savedBoot.mode === "global" || savedBoot.mode === "local-node");
  if (!skipDetection) {
    nativeRuntime = await detectNativeRuntime();
    log(`native runtime: node=${nativeRuntime && nativeRuntime.node ? nativeRuntime.node.raw : "missing"}, npm=${nativeRuntime && nativeRuntime.npm ? nativeRuntime.npm.raw : "missing"}, npx=${nativeRuntime && nativeRuntime.npx ? nativeRuntime.npx.raw : "missing"}, dsh=${nativeRuntime && nativeRuntime.dsh ? nativeRuntime.dsh.raw : "missing"}`);
  }

  let resume = false;
  let repairRuntime = false;
  if (savedBoot) {
    if (savedBoot.mode === "native") {
      // 本机环境仍可用 → 直接以本机环境启动
      if (nativeRuntime && nativeRuntime.installed && nativeRuntime.dshPath) {
        setRuntimeMode(savedBoot.mode === "global" ? "global" : "native");
        resume = true;
      }
    } else if (
      savedBoot.runtimeDir
      && hasHealthyAppRuntime()
    ) {
      // 之前安装的运行时仍在 → 直接启动（日后更新以该安装为主）
      setRuntimeDir(savedBoot.runtimeDir);
      setRuntimeMode(savedBoot.mode === "local-node" ? "bundled" : savedBoot.mode);
      resume = true;
    } else if (
      savedBoot.runtimeDir
      && fs.existsSync(NODE_EXE)
    ) {
      // 旧版本可能留下不完整的 npm/dsh。保留原安装位置并自动重建 Node
      // 运行时，避免用户每次打开又被带回安装向导。
      setRuntimeMode("bundled");
      repairRuntime = true;
      resume = true;
    }
    if (resume) {
      log(`resume boot mode: ${savedBoot.mode}`);
    } else {
      // 安装记录失效（目录/本机环境被移除）：清空记录，重新走向导
      log("saved boot choice invalid, re-running wizard");
      try { fs.rmSync(BOOT_FILE(), { force: true }); } catch { /* ignore */ }
    }
  }
  if (resume) {
    // 规则4：已安装过 → 启动页 + 进度条加载 → 拉起服务 → 进软件
    if (repairRuntime) {
      sendBoot(win, { page: "installing", installing: true, stage: "正在修复 DeepSeek Harness 依赖…", percent: 45 });
      const repaired = await ensurePortableRuntime(win);
      if (!repaired) {
        log("saved runtime repair failed, re-running wizard");
        try { fs.rmSync(BOOT_FILE(), { force: true }); } catch { /* ignore */ }
        await runStartupWizard(win);
        return;
      }
    }
    await bootServer(win);
  } else {
    log("showing detection wizard");
    await runStartupWizard(win);
  }
});

/** 起服务并把窗口导航到主界面（含更新静默检查）。 */
async function bootServer(win) {
  log(`dsh version: ${bundledDshVersion()}`);
  const port = await startServer(win);
  if (port === null) return;
  const url = `http://127.0.0.1:${port}`;
  log(`GUI ready at ${url}`);
  // 启动画面 → 主界面：导航时保持主题实色底，避免页面首帧白闪；
  // 页面渲染出主题底色后（dsh:theme 上报）再由主进程恢复毛玻璃透明底。
  win.loadURL(url);

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
}

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
