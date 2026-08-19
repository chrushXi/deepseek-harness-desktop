"use strict";

/**
 * DeepSeek Harness Desktop —— preload。
 *
 * 在页面中注入自绘的毛玻璃半透明窗体标头（拖拽区 + 最小化/最大化/关闭 + 更新按钮），
 * 并通过 contextBridge 暴露窗口控制与更新能力。DSH 页面本身（功能与界面）不做任何改动，
 * 仅在其顶部为窗体标头预留 44px 高度。
 *
 * 更新按钮形态：
 *   - 无更新  ：显示文字「更新」，点击弹出检测结果弹窗；
 *   - 有更新  ：绿色圆形 + 白色向上箭头，点击弹出更新确认弹窗；
 *   - 检查中/更新中：文字 + 标题栏底部流动进度条。
 */

const { contextBridge, ipcRenderer } = require("electron");
const fs = require("node:fs");
const path = require("node:path");

const TITLEBAR_HEIGHT = 44;

/** 内置暴击 PNG：读取本地资源并转成 data URL，避免依赖页面服务器的静态资源路由。 */
const CRITICAL_ICON_DATA = (() => {
  try {
    return `data:image/png;base64,${fs.readFileSync(path.join(__dirname, "assets", "Boom.png")).toString("base64")}`;
  } catch {
    return "";
  }
})();

/** DeepSeek 官方品牌标识路径（viewBox 0 0 24 24）。 */
const OFFICIAL_MARK_PATH = "M23.0584 4.95203C22.8129 4.83203 22.7074 5.06103 22.5639 5.17704C22.5149 5.21454 22.4734 5.26354 22.4319 5.30854C22.0734 5.69155 21.6543 5.94306 21.1073 5.91306C20.3073 5.86806 19.6243 6.11957 19.0203 6.73158C18.8918 5.97706 18.4652 5.52655 17.8162 5.23754C17.4767 5.08753 17.1332 4.93703 16.8952 4.61052C16.7292 4.37801 16.6837 4.11901 16.6007 3.8635C16.5477 3.70949 16.4952 3.55199 16.3177 3.52549C16.1252 3.49549 16.0497 3.65699 15.9742 3.792C15.6722 4.34401 15.5552 4.95203 15.5667 5.56805C15.5932 6.95359 16.1782 8.05712 17.3407 8.84215C17.4727 8.93215 17.5067 9.02215 17.4652 9.15366C17.3857 9.42416 17.2917 9.68667 17.2087 9.95718C17.1557 10.1297 17.0767 10.1677 16.8917 10.0922C16.2537 9.82568 15.7027 9.43117 15.2156 8.95465C14.3891 8.15513 13.6416 7.2726 12.7096 6.58158C12.4906 6.42007 12.2716 6.27007 12.045 6.12707C11.094 5.20354 12.1696 4.44502 12.4186 4.35501C12.6791 4.26101 12.5091 3.938 11.6675 3.942C10.826 3.9455 10.056 4.22751 9.07446 4.60302C8.93096 4.65952 8.77995 4.70052 8.62545 4.73452C7.73492 4.56552 6.80989 4.52802 5.84386 4.63702C4.02481 4.83953 2.57177 5.69955 1.50373 7.1676C0.220694 8.93215 -0.0813148 10.9372 0.288196 13.0283C0.676708 15.2323 1.80174 17.0569 3.53029 18.4834C5.32285 19.9625 7.38741 20.6875 9.74298 20.5485C11.1735 20.466 12.7661 20.2745 14.5626 18.7539C15.0156 18.9795 15.4912 19.0695 16.2797 19.137C16.8872 19.1935 17.4722 19.107 17.9252 19.013C18.6347 18.8629 18.5857 18.2059 18.3292 18.0854C16.2497 17.1169 16.7062 17.5109 16.2912 17.1919C17.3477 15.9419 18.9618 13.7198 19.4598 10.6942C19.5088 10.3602 19.5713 9.88968 19.5638 9.61917C19.5598 9.45417 19.5978 9.39016 19.7863 9.37116C20.3073 9.31116 20.8128 9.16866 21.2773 8.91315C22.6249 8.17713 23.1684 6.96809 23.2964 5.51905C23.3154 5.29754 23.2924 5.06853 23.0584 4.95203ZM11.3165 17.9954C9.30097 16.4109 8.32344 15.8894 7.91992 15.9119C7.54241 15.9344 7.61042 16.3664 7.69342 16.6479C7.78042 16.9259 7.89342 17.1174 8.05193 17.3614C8.16143 17.5229 8.23694 17.7629 7.94243 17.9434C7.29341 18.3449 6.16487 17.8084 6.11187 17.7819C4.79833 17.0084 3.7003 15.9874 2.92628 14.5908C2.17875 13.2468 1.74474 11.8047 1.67324 10.2657C1.65424 9.89418 1.76374 9.76267 2.13375 9.69517C2.62077 9.60517 3.12278 9.58617 3.6093 9.65767C5.66636 9.95818 7.41741 10.8777 8.88545 12.3348C9.72348 13.1643 10.3575 14.1558 11.0105 15.1243C11.705 16.1529 12.4521 17.1329 13.4036 17.9364C13.7396 18.2179 14.0076 18.4319 14.2641 18.5899C13.4906 18.6764 12.1996 18.6949 11.3165 17.9964V17.9954ZM12.2826 11.7817C12.2826 11.6167 12.4146 11.4852 12.5806 11.4852C12.6181 11.4852 12.6521 11.4927 12.6826 11.5037C12.7241 11.5187 12.7621 11.5412 12.7921 11.5752C12.8451 11.6277 12.8751 11.7027 12.8751 11.7817C12.8751 11.9467 12.7431 12.0782 12.5771 12.0782C12.4111 12.0782 12.2826 11.9467 12.2826 11.7817ZM15.2831 13.3208C15.0906 13.3998 14.8981 13.4673 14.7131 13.4748C14.4261 13.4898 14.1131 13.3733 13.9431 13.2308C13.6791 13.0093 13.4901 12.8853 13.4111 12.4988C13.3771 12.3338 13.3961 12.0782 13.4261 11.9317C13.4941 11.6162 13.4186 11.4137 13.1961 11.2297C13.0151 11.0797 12.7846 11.0382 12.5316 11.0382C12.4371 11.0382 12.3506 10.9967 12.2861 10.9632C12.1806 10.9107 12.0936 10.7792 12.1766 10.6177C12.2031 10.5652 12.3316 10.4377 12.3616 10.4152C12.7051 10.2197 13.1011 10.2837 13.4676 10.4302C13.8071 10.5692 14.0641 10.8242 14.4336 11.1847C14.8111 11.6202 14.8791 11.7402 15.0941 12.0672C15.2641 12.3228 15.4186 12.5853 15.5247 12.8858C15.5887 13.0733 15.5057 13.2268 15.2831 13.3208Z";

const TITLEBAR_CSS = `
#dsh-titlebar {
  --tb-height: ${TITLEBAR_HEIGHT}px;
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--tb-height);
  z-index: 2147483646;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding-left: 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2, rgba(128,128,128,.25)) 60%, transparent);
  /* 毛玻璃半透明：半透明底色 + 背景模糊 */
  background: color-mix(in srgb, var(--dsw-alias-bg-base, #171a21) 62%, transparent);
  -webkit-backdrop-filter: blur(22px) saturate(170%);
  backdrop-filter: blur(22px) saturate(170%);
  -webkit-app-region: drag;
  user-select: none;
  font-family: -apple-system, "Segoe UI", "Microsoft YaHei", system-ui, sans-serif;
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
#dsh-titlebar .dsh-tb-brand {
  display: flex; align-items: center; gap: 9px;
  font-size: 12.5px; font-weight: 600; letter-spacing: .02em;
  white-space: nowrap; overflow: hidden;
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
#dsh-titlebar .dsh-tb-brand .dsh-tb-mark { display: block; flex: none; }
#dsh-titlebar .dsh-tb-spacer { flex: 1; }
#dsh-titlebar .dsh-tb-balance {
  position: relative; display: inline-flex; align-items: center; gap: 7px;
  flex: none; height: 34px; margin-right: 12px; padding: 0;
  overflow: visible; white-space: nowrap; pointer-events: auto; -webkit-app-region: no-drag;
  color: var(--dsw-alias-label-secondary, #aeb3bd);
  font-size: 12px; line-height: 1; font-variant-numeric: tabular-nums;
}
#dsh-titlebar .dsh-tb-balance-label,
#dsh-titlebar .dsh-tb-balance-amount {
  color: var(--dsw-alias-label-secondary, #aeb3bd); font-size: 12px; font-weight: 500;
  letter-spacing: 0; font-variant-numeric: tabular-nums;
}
#dsh-titlebar .dsh-tb-balance-delta {
  display: inline-flex; align-items: center; gap: 2px; min-width: 34px;
  color: var(--dsw-alias-label-secondary, #aeb3bd); font-size: 12px; font-weight: 500;
  font-variant-numeric: tabular-nums; transition: color .18s ease, opacity .18s ease;
}
#dsh-titlebar .dsh-tb-balance-delta.dsh-tb-delta-red { color: #e45555; }
#dsh-titlebar .dsh-tb-balance-delta.dsh-tb-delta-green { color: #3ba96b; }
#dsh-titlebar .dsh-tb-balance-season { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500; }
#dsh-titlebar .dsh-tb-balance-season.dsh-tb-season-peak { color: #e45555; }
#dsh-titlebar .dsh-tb-balance-season.dsh-tb-season-valley { color: #3ba96b; }
#dsh-titlebar .dsh-tb-season-dot {
  width: 6px; height: 6px; border-radius: 50%; display: inline-block;
  animation: dsh-tb-season-breathe 1.8s ease-in-out infinite;
}
#dsh-titlebar .dsh-tb-season-dot.dsh-tb-season-dot-peak { background: #e45555; box-shadow: 0 0 5px rgba(228,85,85,.9); }
#dsh-titlebar .dsh-tb-season-dot.dsh-tb-season-dot-valley { background: #3ba96b; box-shadow: 0 0 5px rgba(59,169,107,.9); }
#dsh-titlebar .dsh-tb-panel-season.dsh-tb-season-peak { color: #e45555; }
#dsh-titlebar .dsh-tb-panel-season.dsh-tb-season-valley { color: #3ba96b; }
@keyframes dsh-tb-season-breathe {
  0%, 100% { opacity: .58; transform: scale(.82); }
  50% { opacity: 1; transform: scale(1.16); }
}
#dsh-titlebar .dsh-tb-balance-panel {
  position: absolute; top: 39px; right: 0; z-index: 2147483647;
  display: none; width: 214px; padding: 10px 12px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
  border-radius: 8px; background: var(--dsw-alias-bg-module-platform, #171b24);
  box-shadow: 0 10px 28px rgba(0,0,0,.28); color: var(--dsw-alias-label-primary, #e8eaf0);
  font-size: 11px; line-height: 1.55; pointer-events: auto;
}
#dsh-titlebar .dsh-tb-balance-panel.dsh-tb-panel-open { display: block; }
#dsh-titlebar .dsh-tb-panel-title { margin-bottom: 5px; font-size: 11px; font-weight: 700; }
#dsh-titlebar .dsh-tb-panel-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
#dsh-titlebar .dsh-tb-panel-row + .dsh-tb-panel-row { margin-top: 3px; }
#dsh-titlebar .dsh-tb-panel-muted { color: var(--dsw-alias-label-tertiary, #8a8f98); }
#dsh-titlebar .dsh-tb-balance-amount.dsh-tb-balance-hit {
  animation: dsh-tb-balance-hit .44s cubic-bezier(.2,.9,.25,1);
}
#dsh-titlebar .dsh-tb-balance-amount.dsh-tb-balance-miss {
  animation: dsh-tb-balance-miss .62s cubic-bezier(.2,.86,.25,1);
}
#dsh-titlebar .dsh-tb-critical-icon { width: 18px; height: 18px; flex: none; display: block; object-fit: contain; }
@keyframes dsh-tb-balance-hit {
  0% { transform: translateY(0) scale(1); }
  26% { transform: translateY(2px) scale(.98); }
  58% { transform: translateY(-1px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes dsh-tb-balance-miss {
  0% { transform: translate(0, 0) scale(1); }
  18% { transform: translate(-2px, 2px) scale(.95); }
  34% { transform: translate(2px, 0) scale(1.05); }
  52% { transform: translate(-1px, 0) scale(1.02); }
  100% { transform: translate(0, 0) scale(1); }
}
#dsh-titlebar .dsh-tb-btn {
  -webkit-app-region: no-drag;
  appearance: none; border: none; cursor: pointer;
  height: 100%; min-width: 46px; padding: 0 10px;
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent;
  color: var(--dsw-alias-label-secondary, #aeb3bd);
  font-size: 12px;
  transition: background .12s ease, color .12s ease;
}
#dsh-titlebar .dsh-tb-btn svg { display: block; }
#dsh-titlebar .dsh-tb-btn:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.08)); color: var(--dsw-alias-label-primary, #e8eaf0); }
#dsh-titlebar .dsh-tb-btn:active { background: rgba(255,255,255,.05); }
#dsh-titlebar .dsh-tb-btn.dsh-tb-close:hover { background: #e81123; color: #fff; }
/* 更新按钮：无更新时显示文字 */
#dsh-titlebar .dsh-tb-btn.dsh-tb-update {
  min-width: auto; gap: 6px; padding: 0 12px; margin-right: 6px;
  border-radius: 8px; font-size: 12px; font-weight: 500;
}
#dsh-titlebar .dsh-tb-btn.dsh-tb-update .dsh-tb-update-avail { display: inline-flex; align-items: center; justify-content: center; }
/* 关键：hidden 属性必须生效（否则 display:inline-flex 会覆盖 [hidden] 导致绿箭头常显） */
#dsh-titlebar .dsh-tb-btn.dsh-tb-update .dsh-tb-update-avail[hidden] { display: none; }
#dsh-titlebar .dsh-tb-btn.dsh-tb-update .dsh-tb-update-avail svg { display: block; }
#dsh-titlebar .dsh-tb-btn.dsh-tb-update:hover .dsh-tb-update-avail { transform: scale(1.08); }
#dsh-titlebar .dsh-tb-btn.dsh-tb-update .dsh-tb-update-avail svg { transition: transform .15s ease; }
#dsh-titlebar .dsh-tb-btn.dsh-tb-update.dsh-tb-busy { opacity: .8; cursor: progress; }
/* 更新进度条：标题栏底部 3px 流动条 */
#dsh-titlebar .dsh-tb-progress {
  position: absolute; left: 0; right: 0; bottom: 0; height: 3px;
  overflow: hidden; pointer-events: none;
  display: none;
}
#dsh-titlebar .dsh-tb-progress.dsh-tb-progress-on { display: block; }
#dsh-titlebar .dsh-tb-progress-inner {
  height: 100%; width: 35%;
  background: linear-gradient(90deg, #2ea043, #4ade80);
  border-radius: 3px;
  animation: dsh-tb-progress-slide 1.4s ease-in-out infinite;
}
@keyframes dsh-tb-progress-slide {
  0% { margin-left: -35%; }
  100% { margin-left: 100%; }
}
html, body { height: 100%; }
#root { box-sizing: border-box; height: 100%; padding-top: ${TITLEBAR_HEIGHT}px !important; }
/* 余额由桌面标题栏承载，隐藏内置插件的右下角承载层，避免重复显示。 */
body [data-token-monitor-balance] { display: none !important; }
`;

function injectTitlebar() {
  if (document.getElementById("dsh-titlebar")) return;

  const style = document.createElement("style");
  style.id = "dsh-titlebar-style";
  style.textContent = TITLEBAR_CSS;
  document.head.appendChild(style);

  const bar = document.createElement("div");
  bar.id = "dsh-titlebar";
  bar.innerHTML = `
    <div class="dsh-tb-brand">
      <svg class="dsh-tb-mark" width="16" height="16" viewBox="0 0 24 24" fill="#4D6BFE" fill-rule="evenodd" aria-hidden="true"><path d="${OFFICIAL_MARK_PATH}"/></svg>
      <span>DeepSeek Harness</span>
    </div>
    <div class="dsh-tb-spacer"></div>
    <div class="dsh-tb-balance" id="dsh-tb-balance" title="DeepSeek 账户余额">
      <span class="dsh-tb-balance-label">当前余额</span>
      <span class="dsh-tb-balance-amount" id="dsh-tb-balance-amount">￥&#160;--</span>
      <span class="dsh-tb-balance-season dsh-tb-season-valley" id="dsh-tb-balance-season"><span class="dsh-tb-season-dot dsh-tb-season-dot-valley" id="dsh-tb-season-dot"></span></span>
      <div class="dsh-tb-balance-panel" id="dsh-tb-balance-panel" role="dialog" aria-label="余额详情">
        <div class="dsh-tb-panel-title">DeepSeek 余额</div>
        <div class="dsh-tb-panel-row"><span class="dsh-tb-panel-muted">可用余额</span><strong id="dsh-tb-panel-total">--</strong></div>
        <div class="dsh-tb-panel-row"><span class="dsh-tb-panel-muted">赠送余额</span><span id="dsh-tb-panel-granted">--</span></div>
        <div class="dsh-tb-panel-row"><span class="dsh-tb-panel-muted">峰谷</span><span class="dsh-tb-panel-season dsh-tb-season-valley" id="dsh-tb-panel-season">谷</span></div>
      </div>
      <span class="dsh-tb-balance-delta" id="dsh-tb-balance-delta">±&#160;00.00</span>
    </div>
    <button class="dsh-tb-btn dsh-tb-update" id="dsh-tb-update" title="检查更新" type="button">
      <span class="dsh-tb-update-label">更新</span>
      <span class="dsh-tb-update-avail" hidden>
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="9.2" fill="#2ea043"/>
          <path d="M10 4.2 L14.4 9.2 H11.5 V15.2 H8.5 V9.2 H5.6 Z" fill="#ffffff"/>
        </svg>
      </span>
    </button>
    <button class="dsh-tb-btn" id="dsh-tb-min" title="最小化" type="button">
      <svg width="12" height="12" viewBox="0 0 12 12"><line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" stroke-width="1.2"/></svg>
    </button>
    <button class="dsh-tb-btn" id="dsh-tb-max" title="最大化" type="button">
      <svg class="dsh-tb-max-ico" width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
    </button>
    <button class="dsh-tb-btn dsh-tb-close" id="dsh-tb-close" title="关闭" type="button">
      <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.2"/></svg>
    </button>
    <div class="dsh-tb-progress" id="dsh-tb-progress"><div class="dsh-tb-progress-inner"></div></div>
  `;
  document.body.appendChild(bar);

  const $ = (id) => bar.querySelector("#" + id);

  $("dsh-tb-min").addEventListener("click", () => api.minimize());
  $("dsh-tb-close").addEventListener("click", () => api.close());
  const maxBtn = $("dsh-tb-max");
  maxBtn.addEventListener("click", () => api.toggleMaximize());
  api.onMaximizedChange((maximized) => {
    maxBtn.title = maximized ? "还原" : "最大化";
    maxBtn.querySelector("svg").innerHTML = maximized
      ? '<rect x="3" y="3" width="8" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M6 3 V2 a1 1 0 0 1 1 -1 h4 a1 1 0 0 1 1 1 v4 a1 1 0 0 1 -1 1 h-1" fill="none" stroke="currentColor" stroke-width="1.2"/>'
      : '<rect x="1" y="1" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.2"/>';
  });

  // 更新按钮状态机：idle(文字"更新") / available(绿箭头) / checking / updating(+进度条)
  const updateBtn = $("dsh-tb-update");
  const updateLabel = updateBtn.querySelector(".dsh-tb-update-label");
  const updateAvail = updateBtn.querySelector(".dsh-tb-update-avail");
  const progress = $("dsh-tb-progress");
  updateBtn.addEventListener("click", () => api.checkUpdate(false));

  // 内置 damage-pulse 标题栏读数。标题栏是唯一可见承载，右键余额打开详情面板。
  const balance = $("dsh-tb-balance");
  const amount = $("dsh-tb-balance-amount");
  const delta = $("dsh-tb-balance-delta");
  const season = $("dsh-tb-balance-season");
  const seasonDot = $("dsh-tb-season-dot");
  const balancePanel = $("dsh-tb-balance-panel");
  const panelTotal = $("dsh-tb-panel-total");
  const panelGranted = $("dsh-tb-panel-granted");
  const panelSeason = $("dsh-tb-panel-season");
  let balanceValue = null;
  let remoteBalanceValue = null;
  let chargeSeq = 0;
  let chargeSeeded = false;
  let chargeTimer = null;
  let balanceTimer = null;
  let deltaTimer = null;
  let chargePollInFlight = false;

  const fmtMoney = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? `￥\u00a0${n.toFixed(2)}` : "￥\u00a0--";
  };
  const fmtDelta = (value, sign) => {
    const n = Number(value);
    return Number.isFinite(n) ? `${sign}${n.toFixed(2)}` : "--";
  };
  const isPeakNow = () => {
    const hourText = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Shanghai", hour: "2-digit", hour12: false,
    }).formatToParts(new Date()).find((part) => part.type === "hour")?.value;
    const hour = Number(hourText);
    return (hour >= 9 && hour < 12) || (hour >= 14 && hour < 18);
  };
  const updateSeason = () => {
    const peak = isPeakNow();
    season.classList.toggle("dsh-tb-season-peak", peak);
    season.classList.toggle("dsh-tb-season-valley", !peak);
    seasonDot.classList.toggle("dsh-tb-season-dot-peak", peak);
    seasonDot.classList.toggle("dsh-tb-season-dot-valley", !peak);
    panelSeason.textContent = peak ? "峰" : "谷";
    panelSeason.classList.toggle("dsh-tb-season-peak", peak);
    panelSeason.classList.toggle("dsh-tb-season-valley", !peak);
  };
  const criticalIcon = () => `
    <img class="dsh-tb-critical-icon" src="${CRITICAL_ICON_DATA}" alt="" aria-hidden="true">`;
  const showDelta = (event, sign = "-") => {
    const miss = event && event.damageKind === "miss";
    const cost = Number(event && event.cost);
    amount.classList.remove("dsh-tb-balance-hit", "dsh-tb-balance-miss");
    void amount.offsetWidth;
    amount.classList.add(miss ? "dsh-tb-balance-miss" : "dsh-tb-balance-hit");
    delta.className = `dsh-tb-balance-delta ${sign === "+" ? "dsh-tb-delta-green" : "dsh-tb-delta-red"}`;
    if (miss && sign === "-") {
      delta.innerHTML = `${criticalIcon()}<span>${fmtDelta(cost, sign)}</span>`;
    } else {
      delta.textContent = fmtDelta(cost, sign);
    }
    clearTimeout(deltaTimer);
    deltaTimer = setTimeout(() => {
      delta.textContent = "±\u00a000.00";
      delta.className = "dsh-tb-balance-delta";
    }, 1800);
  };
  const renderBalance = () => {
    const shown = balanceValue === null ? NaN : balanceValue;
    amount.textContent = fmtMoney(shown);
    panelTotal.textContent = fmtMoney(shown);
  };
  const pollCharges = async () => {
    if (chargePollInFlight) return;
    chargePollInFlight = true;
    try {
      const res = await fetch(`/api/token-monitor/charge-events?since=${chargeSeq}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (!chargeSeeded) {
        chargeSeq = typeof data.seq === "number" ? data.seq : chargeSeq;
        chargeSeeded = true;
        return;
      }
      if (Array.isArray(data.events)) {
        for (const event of data.events) {
          if (typeof event.seq === "number") chargeSeq = Math.max(chargeSeq, event.seq);
          if (balanceValue !== null && Number.isFinite(Number(event.cost))) {
            balanceValue = Math.max(0, balanceValue - Number(event.cost));
            renderBalance();
          }
          showDelta(event, "-");
        }
      }
      if (typeof data.seq === "number") chargeSeq = Math.max(chargeSeq, data.seq);
    } catch { /* server may not be ready during page navigation */ }
    finally { chargePollInFlight = false; }
  };
  const pollBalance = async () => {
    try {
      const res = await fetch("/api/token-monitor/balance", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !Number.isFinite(Number(data.totalBalance))) {
        amount.textContent = "--";
        panelTotal.textContent = "--";
        panelGranted.textContent = "--";
        balance.title = "DeepSeek 账户余额同步中…";
        return;
      }
      const next = Number(data.totalBalance);
      const remoteDelta = remoteBalanceValue === null ? 0 : next - remoteBalanceValue;
      remoteBalanceValue = next;
      // 远端值发生变化时才校准，远端缓存未变时保留本地新事件扣减，避免金额来回跳。
      if (balanceValue === null || Math.abs(remoteDelta) > 1e-9) balanceValue = next;
      renderBalance();
      panelGranted.textContent = fmtMoney(Number(data.grantedBalance) || 0);
      balance.title = `DeepSeek 账户余额：${fmtMoney(next)}${data.grantedBalance > 0 ? `，赠送 ${fmtMoney(data.grantedBalance)}` : ""}`;
      if (Math.abs(remoteDelta) > 1e-9) showDelta({ cost: Math.abs(remoteDelta), damageKind: "normal" }, remoteDelta > 0 ? "+" : "-");
    } catch { /* keep the last known titlebar value */ }
  };
  balance.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    balancePanel.classList.toggle("dsh-tb-panel-open");
  });
  document.addEventListener("pointerdown", (event) => {
    if (!balance.contains(event.target)) balancePanel.classList.remove("dsh-tb-panel-open");
  });
  void pollBalance();
  void pollCharges();
  updateSeason();
  // 每秒读取本地余额缓存；Host 余额服务本身仍按其轮询周期访问官方接口。
  balanceTimer = setInterval(pollBalance, 1000);
  // 扣费事件由 Host 在 usage 到达后立即入队；短轮询让标题栏尽快反映结果。
  chargeTimer = setInterval(pollCharges, 250);
  setInterval(updateSeason, 30000);

  api.onUpdateStatus((status) => {
    const state = status && status.state ? status.state : "idle";
    const busy = state === "checking" || state === "updating";
    updateBtn.classList.toggle("dsh-tb-busy", busy);
    progress.classList.toggle("dsh-tb-progress-on", state === "updating");
    if (state === "available") {
      updateLabel.hidden = true;
      updateAvail.hidden = false;
      updateBtn.title = `发现新版本 v${status.latest}，点击更新`;
    } else if (state === "checking") {
      updateLabel.hidden = false;
      updateAvail.hidden = true;
      updateLabel.textContent = "检查中…";
      updateBtn.title = "正在检查更新…";
    } else if (state === "updating") {
      updateLabel.hidden = false;
      updateAvail.hidden = true;
      updateLabel.textContent = "更新中…";
      updateBtn.title = "正在下载并安装更新…";
    } else {
      updateLabel.hidden = false;
      updateAvail.hidden = true;
      updateLabel.textContent = "更新";
      updateBtn.title = "检查更新";
    }
  });
}

const UPDATE_DIALOG_CSS = `
#dsh-update-dialog {
  /* 强调色：DeepSeek 品牌蓝，浅色/深色主题下均清晰；
     表面色（背景/文字/边框）通过下方 --dsw-alias-* 变量跟随软件明暗主题 */
  --dsh-ud-accent: #4d6bfe;
  position: fixed; inset: 0; z-index: 2147483647;
  display: none; align-items: center; justify-content: center;
  background: rgba(8, 10, 16, 0.25);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  font-family: -apple-system, "Segoe UI", "Microsoft YaHei", system-ui, sans-serif;
}
#dsh-update-dialog.dsh-ud-open { display: flex; }
.dsh-ud-card {
  width: 430px; max-width: calc(100vw - 40px);
  border-radius: 16px; overflow: hidden;
  /* 纯色不透明，跟随主题 */
  background: var(--dsw-alias-bg-module-platform, #171b24);
  border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
  box-shadow: 0 10px 30px rgba(0,0,0,.22);
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
.dsh-ud-head {
  display: flex; align-items: center; gap: 8px;
  /* 收窄的标题栏：更矮、无蓝色底、跟随主题 */
  padding: 7px 12px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
  background: transparent;
}
.dsh-ud-mark { color: var(--dsh-ud-accent); flex: none; display: block; }
.dsh-ud-head .dsh-ud-title { font-size: 13px; font-weight: 600; flex: 1; color: var(--dsw-alias-label-primary, #e8eaf0); }
.dsh-ud-close {
  -webkit-app-region: no-drag;
  appearance: none; border: none; background: transparent; cursor: pointer;
  color: var(--dsw-alias-label-tertiary, #8a8f98);
  width: 24px; height: 24px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
}
.dsh-ud-close:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.08)); color: var(--dsw-alias-label-primary, #e8eaf0); }
.dsh-ud-body { padding: 18px 20px 20px; }
.dsh-ud-row { display: flex; align-items: center; gap: 14px; }
.dsh-ud-msg { font-size: 14px; font-weight: 500; }
.dsh-ud-sub { font-size: 12px; color: var(--dsw-alias-label-tertiary, #8a8f98); margin-top: 4px; line-height: 1.6; }
.dsh-ud-icon { flex: none; }
.dsh-ud-icon-accent { color: var(--dsh-ud-accent); }
.dsh-ud-spinner {
  width: 34px; height: 34px; flex: none; border-radius: 50%;
  border: 3px solid color-mix(in srgb, var(--dsh-ud-accent) 22%, transparent);
  border-top-color: var(--dsh-ud-accent);
  animation: dsh-ud-spin .9s linear infinite;
}
@keyframes dsh-ud-spin { to { transform: rotate(360deg); } }
.dsh-ud-versions { margin-top: 14px; display: flex; align-items: center; gap: 10px; }
.dsh-ud-vtag {
  font-size: 13px; font-weight: 600; font-family: ui-monospace, Consolas, monospace;
  padding: 4px 10px; border-radius: 8px;
  background: color-mix(in srgb, #000 12%, var(--dsw-alias-bg-module-platform, #171b24));
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2, rgba(128,128,128,.25)) 70%, var(--dsw-alias-bg-module-platform, #171b24));
}
.dsh-ud-vtag-new { color: var(--dsh-ud-accent); border-color: color-mix(in srgb, var(--dsh-ud-accent) 45%, transparent); }
.dsh-ud-arrow { color: var(--dsh-ud-accent); font-weight: 700; font-size: 14px; }
.dsh-ud-changelog {
  margin-top: 12px; max-height: 190px; overflow: auto;
  padding: 10px 12px; border-radius: 10px;
  background: color-mix(in srgb, #000 10%, var(--dsw-alias-bg-module-platform, #171b24));
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2, rgba(128,128,128,.25)) 70%, var(--dsw-alias-bg-module-platform, #171b24));
  font-size: 12px; line-height: 1.65; white-space: pre-wrap; word-break: break-word;
  color: var(--dsw-alias-label-secondary, #b4b9c2);
}
.dsh-ud-changelog .dsh-ud-cl-head { color: var(--dsh-ud-accent); font-weight: 600; margin-bottom: 4px; }
.dsh-ud-detail {
  margin-top: 12px; max-height: 130px; overflow: auto;
  padding: 8px 10px; border-radius: 8px;
  background: color-mix(in srgb, #000 10%, var(--dsw-alias-bg-module-platform, #171b24));
  border: 1px solid color-mix(in srgb, var(--dsw-alias-border-l2, rgba(128,128,128,.25)) 70%, var(--dsw-alias-bg-module-platform, #171b24));
  font-size: 11.5px; line-height: 1.5; white-space: pre-wrap; word-break: break-all;
  color: var(--dsw-alias-label-secondary, #b4b9c2);
  font-family: ui-monospace, Consolas, monospace;
}
.dsh-ud-bar { margin-top: 14px; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--dsh-ud-accent) 22%, var(--dsw-alias-bg-module-platform, #171b24)); overflow: hidden; }
.dsh-ud-bar-inner {
  height: 100%; width: 40%;
  background: var(--dsh-ud-accent);
  border-radius: 3px;
  animation: dsh-ud-slide 1.3s ease-in-out infinite;
}
@keyframes dsh-ud-slide { 0% { margin-left: -40%; } 100% { margin-left: 100%; } }
.dsh-ud-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }
.dsh-ud-btn {
  -webkit-app-region: no-drag;
  appearance: none; border: none; cursor: pointer;
  padding: 8px 20px; border-radius: 10px;
  font-size: 13px; font-weight: 500; font-family: inherit;
  transition: transform .08s ease, filter .12s ease, background .12s ease;
}
.dsh-ud-btn:active { transform: scale(.97); }
.dsh-ud-btn-primary {
  background: var(--dsh-ud-accent);
  color: #fff;
}
.dsh-ud-btn-primary:hover { filter: brightness(1.08); }
.dsh-ud-btn-ghost {
  background: transparent;
  color: var(--dsw-alias-label-secondary, #b4b9c2);
  border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.3));
}
.dsh-ud-btn-ghost:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.07)); }
`;

const UD_ICONS = {
  check: '<svg class="dsh-ud-icon" width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#2ea043"/><path d="M7 12.5 L10.5 16 L17 8.5" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  warn: '<svg class="dsh-ud-icon" width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#d97706"/><path d="M12 7 v6 M12 16.4 v.01" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  error: '<svg class="dsh-ud-icon" width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e5484d"/><path d="M8 8 L16 16 M16 8 L8 16" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  upgrade: '<svg class="dsh-ud-icon dsh-ud-icon-accent" width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M12 5.6 L16.6 10.5 H13.6 V17.4 H10.4 V10.5 H7.4 Z" fill="#fff"/></svg>',
};

function ensureUpdateDialog() {
  if (document.getElementById("dsh-update-dialog")) return document.getElementById("dsh-update-dialog");
  const style = document.createElement("style");
  style.id = "dsh-update-dialog-style";
  style.textContent = UPDATE_DIALOG_CSS;
  document.head.appendChild(style);

  const dlg = document.createElement("div");
  dlg.id = "dsh-update-dialog";
  dlg.innerHTML = `
    <div class="dsh-ud-card">
      <div class="dsh-ud-head">
        <svg class="dsh-ud-mark" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="${OFFICIAL_MARK_PATH}"/></svg>
        <div class="dsh-ud-title" id="dsh-ud-title">检查更新</div>
        <button class="dsh-ud-close" id="dsh-ud-close" title="关闭" type="button">
          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" stroke-width="1.2"/></svg>
        </button>
      </div>
      <div class="dsh-ud-body" id="dsh-ud-body"></div>
    </div>`;
  document.body.appendChild(dlg);
  dlg.querySelector("#dsh-ud-close").addEventListener("click", () => api.updateAction("close"));
  return dlg;
}

/** 弹窗状态渲染：返回 { body, title, closable }。 */
function renderUpdateState(evt) {
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  switch (evt.type) {
    case "checking":
      return {
        title: "检查更新",
        closable: false,
        body: `<div class="dsh-ud-row">
          <div class="dsh-ud-spinner"></div>
          <div><div class="dsh-ud-msg">正在检查更新…</div><div class="dsh-ud-sub">当前版本 v${esc(evt.current)}</div></div>
        </div>`,
      };
    case "up-to-date":
      return {
        title: "检查更新",
        closable: true,
        body: `<div class="dsh-ud-row">
          ${UD_ICONS.check}
          <div><div class="dsh-ud-msg">已是最新版本</div><div class="dsh-ud-sub">当前版本 v${esc(evt.current)}，官方最新 v${esc(evt.latest)}</div></div>
        </div>
        <div class="dsh-ud-actions"><button class="dsh-ud-btn dsh-ud-btn-primary" data-act="close">完成</button></div>`,
      };
    case "check-failed":
      return {
        title: "检查更新",
        closable: true,
        body: `<div class="dsh-ud-row">
          ${UD_ICONS.warn}
          <div><div class="dsh-ud-msg">检查更新失败</div><div class="dsh-ud-sub">${esc(evt.detail)}</div></div>
        </div>
        <div class="dsh-ud-actions">
          <button class="dsh-ud-btn dsh-ud-btn-ghost" data-act="close">关闭</button>
          <button class="dsh-ud-btn dsh-ud-btn-primary" data-act="retry-check">重试</button>
        </div>`,
      };
    case "available":
      return {
        title: "发现新版本",
        closable: true,
        body: `<div class="dsh-ud-row">
          ${UD_ICONS.upgrade}
          <div><div class="dsh-ud-msg">发现新版本 v${esc(evt.latest)}</div><div class="dsh-ud-sub">当前版本 v${esc(evt.current)}</div></div>
        </div>
        <div class="dsh-ud-versions">
          <span class="dsh-ud-vtag">v${esc(evt.current)}</span>
          <span class="dsh-ud-arrow">→</span>
          <span class="dsh-ud-vtag dsh-ud-vtag-new">v${esc(evt.latest)}</span>
        </div>
        <div class="dsh-ud-changelog" id="dsh-ud-changelog">
          <div class="dsh-ud-cl-head">更新说明</div><span class="dsh-ud-cl-body">正在加载…</span>
        </div>
        <div class="dsh-ud-actions">
          <button class="dsh-ud-btn dsh-ud-btn-ghost" data-act="cancel">取消</button>
          <button class="dsh-ud-btn dsh-ud-btn-primary" data-act="confirm">立即更新</button>
        </div>`,
      };
    case "updating":
      return {
        title: "正在更新",
        closable: false,
        body: `<div class="dsh-ud-row">
          <div class="dsh-ud-spinner"></div>
          <div><div class="dsh-ud-msg">正在更新…</div><div class="dsh-ud-sub">正在从 npm 官方源下载并安装 v${esc(evt.latest)}，请稍候…</div></div>
        </div>
        <div class="dsh-ud-bar"><div class="dsh-ud-bar-inner"></div></div>`,
      };
    case "update-failed":
      return {
        title: "更新失败",
        closable: true,
        body: `<div class="dsh-ud-row">
          ${UD_ICONS.error}
          <div><div class="dsh-ud-msg">更新失败</div><div class="dsh-ud-sub">已恢复旧版本运行</div></div>
        </div>
        <div class="dsh-ud-detail">${esc(evt.detail)}</div>
        <div class="dsh-ud-actions">
          <button class="dsh-ud-btn dsh-ud-btn-ghost" data-act="close">关闭</button>
          <button class="dsh-ud-btn dsh-ud-btn-primary" data-act="retry">重试</button>
        </div>`,
      };
    case "success":
      return {
        title: "更新完成",
        closable: true,
        body: `<div class="dsh-ud-row">
          ${UD_ICONS.check}
          <div><div class="dsh-ud-msg">更新完成</div><div class="dsh-ud-sub">已从 v${esc(evt.current)} 切换到 v${esc(evt.latest)}</div></div>
        </div>
        <div class="dsh-ud-actions"><button class="dsh-ud-btn dsh-ud-btn-primary" data-act="close">完成</button></div>`,
      };
    default:
      return null;
  }
}

function handleUpdateEvent(evt) {
  if (!evt || typeof evt !== "object") return;
  if (evt.type === "available-changelog") {
    const box = document.getElementById("dsh-ud-changelog");
    if (!box) return;
    const body = box.querySelector(".dsh-ud-cl-body");
    if (evt.changelog) {
      const head = box.querySelector(".dsh-ud-cl-head");
      if (head) head.textContent = `更新说明（${evt.changelog.source} · ${evt.changelog.tag}）`;
      body.textContent = evt.changelog.body;
    } else {
      box.style.display = "none";
    }
    return;
  }
  if (evt.type === "close") {
    const dlg = document.getElementById("dsh-update-dialog");
    if (dlg) dlg.classList.remove("dsh-ud-open");
    return;
  }
  const view = renderUpdateState(evt);
  if (!view) return;
  const dlg = ensureUpdateDialog();
  dlg.querySelector("#dsh-ud-title").textContent = view.title;
  dlg.querySelector("#dsh-ud-close").style.display = view.closable ? "" : "none";
  const body = dlg.querySelector("#dsh-ud-body");
  body.innerHTML = view.body;
  body.querySelectorAll("[data-act]").forEach((btn) => {
    btn.addEventListener("click", () => api.updateAction(btn.dataset.act));
  });
  dlg.classList.add("dsh-ud-open");
}

function boot() {
  const init = () => {
    injectTitlebar();
    // 自绘更新弹窗事件监听（挂载一次；弹窗 DOM 按需创建）
    ipcRenderer.on("dsh:update-event", (_event, evt) => handleUpdateEvent(evt));
    // 通知主进程：本页面 preload 已就绪（用于更新完成后重载页面的握手）
    ipcRenderer.send("dsh:renderer-ready");
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
}

const api = {
  minimize: () => ipcRenderer.send("dsh:win-min"),
  toggleMaximize: () => ipcRenderer.send("dsh:win-max-toggle"),
  close: () => ipcRenderer.send("dsh:win-close"),
  isMaximized: () => ipcRenderer.invoke("dsh:win-is-maximized"),
  onMaximizedChange: (cb) => {
    const listener = (_event, value) => cb(value);
    ipcRenderer.on("dsh:win-maximized", listener);
    return () => ipcRenderer.removeListener("dsh:win-maximized", listener);
  },
  /** silent=true 时只更新按钮状态不弹窗（启动时自动检查）；false 打开自绘更新弹窗 */
  checkUpdate: (silent) => ipcRenderer.send("dsh:check-update", !!silent),
  onUpdateStatus: (cb) => {
    const listener = (_event, status) => cb(status);
    ipcRenderer.on("dsh:update-status", listener);
    return () => ipcRenderer.removeListener("dsh:update-status", listener);
  },
  /** 更新弹窗内用户操作：confirm / cancel / retry / retry-check / close */
  updateAction: (action) => ipcRenderer.send("dsh:update-action", action),
  getVersion: () => ipcRenderer.invoke("dsh:get-version"),
};

contextBridge.exposeInMainWorld("dshDesktop", api);

if (typeof window !== "undefined") boot();
