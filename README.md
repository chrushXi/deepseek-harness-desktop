# DeepSeek Harness Desktop

把本机的 DeepSeek Harness（dsh）封装成 Windows 桌面软件：

- **双击即用**：无需 cmd、无需 `npx @deepseek-ai/dsh web`，无需安装 Node / npm。
- **功能与界面不变**：内部就是官方 `dsh --profile web` 服务器 + 官方前端，本地 127.0.0.1 端口提供。
- **全部打入包内**：捆绑 Node 24 运行时 + 完整依赖树（约 300MB），断网也可运行（登录/会话数据仍在 `~/.dsh`）。
- **毛玻璃半透明窗体标头**：Win11 使用系统 Acrylic + 页面内 backdrop-filter 模糊，标题栏可拖动，含最小化/最大化/关闭与「更新」按钮。
- **一键更新**：点标题栏「更新」按钮，自动对比 npm 官方源（npmmirror，自动回退 npmjs）上的最新 `@deepseek-ai/dsh` 版本，下载安装完成后一键重启生效。

## 目录结构

```
DeepSeekHarness/
├─ main.js                Electron 主进程（启动服务器、窗口、更新）
├─ preload.js             注入毛玻璃标题栏 + 窗口控制/更新桥
├─ package.json           应用清单 + electron-builder 配置
├─ runtime/               运行时（构建脚本生成，打包进 resources/runtime）
│  ├─ node.exe            捆绑 Node 24
│  ├─ node_modules/       完整依赖树（dsh 及其全部依赖）
│  └─ package.json        npm 更新入口
├─ assets/                图标（icon.ico / icon.png）
├─ scripts/
│  ├─ prepare-runtime.ps1 构建 runtime（复制依赖 + 下载 Node）
│  └─ make-icon.mjs       生成图标
└─ dist/                  electron-builder 产物
```

## 构建

```powershell
# 1. 准备运行时（首次）
powershell -ExecutionPolicy Bypass -File scripts\prepare-runtime.ps1

# 2. 安装 electron / electron-builder（已装过可跳过）
npm install

# 3. 开发运行（本地调试）
npm start

# 4. 打包（NSIS 安装版，输出到 dist/）
npm run dist
```

> 国内网络建议先设置镜像环境变量：
> `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/`
> `ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/`

## 打包产物

- `dist/DeepSeekHarness-Setup-<version>-x64.exe` —— NSIS 安装版：可自选安装目录，自动创建桌面/开始菜单快捷方式，卸载干净。
- `dist/win-unpacked/` —— 免安装的完整目录（双击 `DeepSeek Harness.exe` 即可运行，用于快速分发/内测）。

## 数据与日志

- 用户数据（会话、设置、凭据）仍在 `~/.dsh`（即 `C:\Users\<你>\\.dsh`），与官方 CLI 完全共享。
- 运行日志：`%APPDATA%\DeepSeek Harness\logs\server.log`。

## 异常自愈

若 `~/.dsh/profiles/node_modules` 中的条目被外部工具（如手动复制、其他安装）改成了普通文件夹，
DSH 会拒绝启动并提示"exists and is not a symlink"。本应用检测到该错误时会弹窗提供**一键自动修复**
（仅删除 `$DSH_HOME/profiles/node_modules` 内的异常条目，该目录由 DSH 自动维护，可安全重建），修复后自动重启服务器。

## 更新说明

标题栏「更新」按钮（形态随状态变化）：

- **无更新**：显示文字「更新」；点击打开自绘更新弹窗（检查中 → "已是最新版本" / 网络异常重试）。
- **有更新**：自动变成 **绿色圆形 + 白色向上箭头**；点击打开自绘更新弹窗。
- **检查中 / 更新中**：按钮显示「检查中… / 更新中…」，标题栏底部出现 3px 流动进度条。

### 自绘更新弹窗（蓝色主题 · 毛玻璃）

所有更新交互都在这个与软件同风格的弹窗内完成（不再使用系统原生弹窗）：

- **蓝色主题**：主按钮为蓝色渐变，加载动画、进度条、版本箭头均为品牌蓝；卡片为毛玻璃半透明（backdrop-filter 模糊 + 主题色自适应明暗）。
- **状态流转**：正在检查 → 发现新版本（当前/最新版本对比 + 更新说明 + 立即更新/取消）→ 正在更新（进度条，不可关闭）→ 更新完成 / 更新失败（可重试）。
- **更新说明**：优先 GitHub Releases 更新日志（deepseek-ai/deepseek-harness），仓库无 release 时改用 npm 包 README 简介片段；都拿不到则省略。

### 来源与流程

1. 启动后 4 秒静默检查一次（不弹窗，仅切换按钮形态）；之后随时可手动点击。
2. **版本对比与更新文件都来自 npm 官方源**（默认 `registry.npmmirror.com`，失败自动回退 `registry.npmjs.org`）——不是 GitHub。
3. 更新 = 用捆绑 Node/npm 执行 `npm install @deepseek-ai/dsh@最新版`，先停服务器再安装（避免原生模块文件锁），完成后自动重启服务器切换新版本，无需重启应用；失败自动恢复旧版本。
4. 可选：设置环境变量 `DSH_UPDATE_REGISTRY=https://你的内网镜像` 可自定义更新源。
