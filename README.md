# DeepSeek Harness Desktop

把本机的 DeepSeek Harness（dsh）封装成 Windows 桌面软件：

- **双击即用**：无需 cmd、无需 `npx @deepseek-ai/dsh web`，无需安装 Node / npm。
- **功能与界面不变**：内部就是官方 `dsh --profile web` 服务器 + 官方前端，本地 127.0.0.1 端口提供。
- **全部打入包内**：捆绑 Node 24 运行时 + 完整依赖树（约 300MB），断网也可运行（登录/会话数据仍在 `~/.dsh`）。
- **毛玻璃半透明窗体标头**：Win11 使用系统 Acrylic + 页面内 backdrop-filter 模糊，标题栏可拖动，含最小化/最大化/关闭与左上角「设置」按钮（齿轮图标 + 「设置」文字，距离窗口边框 20px，hover 呈现按下的矩形样式）。
- **软件设置弹窗**：左上角设置按钮打开与软件同风格（品牌蓝 · 毛玻璃 · 跟随明暗主题，带滑动/展开/开关动效）的设置弹窗，含「Harness版本」与「通用设置」两项：
  - **Harness版本**：Latest / Next 频道滑块（默认 Latest），打开设置自动检测更新（底部固定状态栏显示结果，不弹窗）；拉取 npm 上 dsh 全部已发布版本，可按版本号选择安装——点击后切换到启动页安装视图（真实进度条 + 安装日志 + 取消按钮），完成或取消后自动返回软件。
  - **通用设置**：余额插件开关（默认开，关闭后标题栏余额隐藏）、余额插件设置下拉（内含峰谷计费设置：模型/价格/峰谷时段，带展开动画）、小票开关（默认开，控制「打印小票」入口）。
  - 标题栏余额组件：**右键直接打开余额详情面板**（面板整体收窄），内含可用/赠送余额、峰谷时段与「打印小票」入口。

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

更新入口已移入左上角「设置」按钮（齿轮 + 「设置」文字）打开的**软件设置弹窗**（Harness版本）：

- **打开自动检测**：打开设置弹窗即自动检查一次更新，状态显示在底部固定栏（不弹窗、不跳动）；也可手动「检查更新」。
- **频道滑块**：Latest / Next（默认 Latest），带滑动药丸动效，决定版本列表展示的频道。
- **版本列表**：从 npm 官方源（npmmirror，自动回退 npmjs）拉取 `@deepseek-ai/dsh` 全部已发布版本，按版本号选择对应安装。
- **静默监控 Next**：启动后自动检查（监控 Next 频道，取全部 dist-tags 与版本中 semver 最高者）；发现新版本时**每个版本只提示一次**——设置按钮出现红点，打开设置弹窗后底部状态栏展示「发现新版本 + 立即更新」。

### 版本安装视图

点击「安装」后，软件界面切换到**启动页安装视图**：

- 展示**真实进度条**（0–100%）与安装日志（npm verbose 输出）；
- 提供**取消安装**按钮：点击后结束 npm 安装进程并恢复旧版本、重启服务，自动返回软件主界面；
- 安装成功：自动重启服务并返回主界面；失败：自动恢复旧版本并返回，服务无法恢复时停留在错误页并提供「返回软件」。
- 可选：设置环境变量 `DSH_UPDATE_REGISTRY=https://你的内网镜像` 可自定义更新源。

## 启动与安装流程

- **快速启动**：双击后先本地渲染启动页（不等窗口边框/黑屏），启动页就绪立即展示，随后并行拉起 dsh 服务；已安装环境下启动页直接进入「正在启动」视图。
- **安装即止**：首次安装完成后停留在「开始使用」页，**不自动拉起服务**；用户点击「开始使用」后才启动服务并进入主界面。
