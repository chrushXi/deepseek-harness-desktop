# DeepSeek Harness Desktop

把本机的 **DeepSeek Harness（dsh）** 封装成 Windows 桌面软件：双击即用，内置余额监控、峰谷计费、会话小票、一键更新等特色功能。

> 界面即官方 `dsh --profile web` 前端，功能与网页版完全一致；本应用只是把「Node 运行时 + dsh + 前端」打包成一个桌面程序，并加上原生窗口与增强插件。

---

## 特色功能

### 🚀 双击即用，免安装环境
- 无需 cmd、无需 `npx @deepseek-ai/dsh web`、无需手动安装 Node / npm。
- 捆绑 Node 24 运行时与 dsh 完整依赖树（约 300MB），打包后断网也可启动（登录/会话数据仍在 `~/.dsh`）。

### ⚡ 快速启动
- 双击后**先本地渲染启动页**（不等窗口边框、不闪黑屏），启动页就绪立即展示，随后并行拉起 dsh 服务。
- 首次安装完成后停留在「开始使用」页，**不自动拉起服务**；点击「开始使用」后才启动服务进入主界面。

### 🔄 直接更新 Harness（一键 / 按版本）
- 左上角「**软件设置**」→「**Harness 版本**」：
  - **打开自动检测更新**：状态显示在底部固定栏，不弹窗、不跳动。
  - **频道滑块**：Latest / Next（默认 Latest，滑动药丸动效）。
  - **版本列表**：从 npm 官方源（npmmirror，自动回退 npmjs）拉取 `@deepseek-ai/dsh` 全部已发布版本，**按版本号选择安装**。
  - **静默监控 Next**：启动后自动检查，发现新版本时**每个版本只提示一次**——设置按钮出现红点，打开设置后底部栏展示「发现新版本 + 立即更新」。
- **版本安装视图**：点击「安装」后切换到安装界面，展示**真实进度条（0–100%）+ npm 安装日志**，可随时**取消**（取消/失败自动恢复旧版本并返回软件），成功后自动重启服务返回主界面。

### 💰 余额监控 + 峰谷计费
- 标题栏右侧常驻显示 **DeepSeek 账户余额**（可用余额 = 官方余额 − 本地待扣费），扣费时有金额变动动画。
- **右键余额** → 打开**余额详情面板**：可用余额 / 赠送余额 / 峰谷时段 / 打印小票。
- 「软件设置 → 通用 → **余额插件设置**」：**白色可折叠**计费表单，可配置模型单价（缓存命中 / 未命中 / 输出）、**峰谷时段**（DeepSeek 多段，24 小时制），保存后立即生效，标题栏峰谷指示（峰/谷）同步更新。

### 🧾 会话小票
- 余额详情面板 → 「**打印小票**」（白色浮起按钮），生成当前会话的**超市小票风格清单**：按模型汇总调用次数、输入/输出/缓存 Token、金额、耗时、缓存命中率、峰谷费用。
- **新会话**（还没有对话记录）打印时展示「**暂无小票记录**」空态，不打印空白小票。
- 可在「软件设置 → 通用 → **会话小票**」中关闭该入口（默认开启）。

### 🎛️ 软件设置弹窗
- 与软件同风格（品牌蓝 · 毛玻璃 · 跟随明暗主题，含滑动/展开/开关动效）。
- 左侧栏：**Harness 版本** / **通用**。
- **通用**：余额插件开关（关闭后标题栏余额隐藏）、余额插件设置（白色可折叠计费表单）、会话小票开关。

### 🪟 毛玻璃标题栏
- Win11 系统 Acrylic + 页面内 backdrop-filter 模糊，标题栏可拖动。
- 左侧「软件设置」按钮（齿轮 + 文字，距边框 20px，hover 按下样式，有新版本时显示红点）；右侧余额 + 最小化/最大化/关闭。

---

## 使用方法

1. **安装**：运行 `DeepSeekHarness-Setup-<版本>-x64.exe`，可自选安装目录。
   > 首次安装需要下载 Node 运行时并安装 dsh 完整依赖树，**耗时几分钟属正常现象**（见下文「关于安装慢」）。
2. **启动**：双击桌面/开始菜单的「DeepSeek Harness」。
3. **首次使用**：若本机缺少环境，安装向导会自动完成；安装完成后点击「**开始使用**」进入主界面。
4. **日常操作**：
   - 查看/打印余额：鼠标**右键**标题栏余额 → 余额详情 → 打印小票。
   - 更新 Harness：左上角「软件设置」→「Harness 版本」→ 选择版本「安装」。
   - 配置计费：软件设置 → 通用 → 余额插件设置 → 修改价格/峰谷时段 → 保存。

---

## 关于安装慢（正常现象）

首次安装「慢」是**预期行为**，请耐心等待，不要中途关闭：

| 阶段 | 内容 | 耗时参考 |
| --- | --- | --- |
| 下载 Node.js | 约 30MB 运行时 | 视网络 10s–2min |
| 安装 DeepSeek Harness | npm 安装 dsh **完整依赖树（数百 MB，含 node-pty 等原生模块）** | 通常 1–5 分钟 |
| 打包装配 | electron-builder 组装约 300MB 应用 | 数分钟 |

- 安装界面有**真实进度条（0–100%）+ 逐行安装日志**，可随时查看进行到哪一步。
- 若长时间停留在「**正在解析安装包**」并显示小圆点动画，说明 npm 正在解析依赖（国内网络下常见），**不是卡死**。
- 安装完成后会停留在「开始使用」页，点击后才会启动服务。
- 更新版本时同理：会切换到安装视图执行下载/替换，可随时**取消**并自动恢复旧版本。

---

## 目录结构

```
DeepSeekHarness/
├─ main.js                Electron 主进程（启动服务器、窗口、更新、安装）
├─ preload.js             注入毛玻璃标题栏、软件设置弹窗、余额面板、小票与安装视图
├─ package.json           应用清单 + electron-builder 配置
├─ internal/damage-pulse  内置余额监控插件（余额/计费/小票 API，打包进 resources）
├─ runtime/               运行时（构建脚本生成，打包进 resources/runtime）
│  ├─ node.exe            捆绑 Node 24
│  ├─ node_modules/       完整依赖树（dsh 及其全部依赖）
│  └─ package.json        npm 更新入口
├─ assets/                图标 + 启动页 + 前端静态资源（harness-web）
├─ scripts/
│  ├─ prepare-runtime.ps1 构建 runtime（复制依赖 + 下载 Node）
│  └─ make-icon.mjs       生成图标
└─ dist/                  electron-builder 产物
```

## 构建（开发者）

```powershell
# 1. 安装内置余额监控插件的依赖（首次，克隆后必做）
cd internal\damage-pulse && npm install && cd ..\..

# 2. 准备运行时（首次；本地 npx 缓存不存在时会自动改用 npm install 构建依赖树）
powershell -ExecutionPolicy Bypass -File scripts\prepare-runtime.ps1

# 3. 安装 electron / electron-builder（已装过可跳过）
npm install

# 4. 开发运行（本地调试）
npm start

# 5. 打包（NSIS 安装版，输出到 dist/）
npm run dist
```

> - `internal/damage-pulse` 的 `node_modules` 不入库（见 .gitignore），克隆后需先执行第 1 步。
> - 国内网络建议先设置镜像环境变量：
>   `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/`
>   `ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/`

## 打包产物

- `dist/DeepSeekHarness-Setup-<version>-x64.exe` —— NSIS 安装版：可自选安装目录，自动创建桌面/开始菜单快捷方式，卸载干净。
- `dist/win-unpacked/` —— 免安装的完整目录（双击 `DeepSeek Harness.exe` 即可运行，用于快速分发/内测）。

## 数据与日志

- 用户数据（会话、设置、凭据）仍在 `~/.dsh`（即 `C:\Users\<你>\\.dsh`），与官方 CLI 完全共享。
- 桌面设置（余额插件 / 会话小票 / 更新频道等）：`%APPDATA%\DeepSeek Harness\settings.json`。
- 运行日志：`%APPDATA%\DeepSeek Harness\logs\server.log`。

## 更新说明

- **更新源**：npm 官方源（默认 `registry.npmmirror.com`，失败自动回退 `registry.npmjs.org`）；可用环境变量 `DSH_UPDATE_REGISTRY=https://你的内网镜像` 自定义。
- **监控频道**：静默监控 Next 频道（取全部 dist-tags 与版本中 semver 最高者），每个新版本只通过设置弹窗提示一次。
- **更新流程**：停服 → `npm install @deepseek-ai/dsh@指定版本` → 重启服务 → 自动返回主界面；失败自动恢复旧版本。

## 异常自愈

若 `~/.dsh/profiles/node_modules` 中的条目被外部工具（如手动复制、其他安装）改成了普通文件夹，
DSH 会拒绝启动并提示 "exists and is not a symlink"。本应用检测到该错误时会弹窗提供**一键自动修复**
（仅删除 `$DSH_HOME/profiles/node_modules` 内的异常条目，该目录由 DSH 自动维护，可安全重建），修复后自动重启服务器。
