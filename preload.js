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
#dsh-titlebar .dsh-tb-balance-season { display: inline-flex; align-items: center; font-size: 12px; font-weight: 600; }
#dsh-titlebar .dsh-tb-balance-season.dsh-tb-season-peak { color: #e45555; }
#dsh-titlebar .dsh-tb-balance-season.dsh-tb-season-valley { color: #3ba96b; }
#dsh-titlebar .dsh-tb-panel-season.dsh-tb-season-peak { color: #e45555; }
#dsh-titlebar .dsh-tb-panel-season.dsh-tb-season-valley { color: #3ba96b; }
#dsh-titlebar .dsh-tb-balance-panel {
  position: absolute; top: 39px; right: 0; z-index: 2147483647;
  display: none; width: 266px; max-width: calc(100vw - 20px); padding: 12px 14px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
  border-radius: 12px; background: var(--dsw-alias-bg-module-platform, #171b24);
  box-shadow: 0 12px 32px rgba(0,0,0,.22); color: var(--dsw-alias-label-primary, #e8eaf0);
  font-size: 12px; line-height: 1.6; pointer-events: auto;
}
#dsh-titlebar .dsh-tb-balance-panel.dsh-tb-panel-open { display: block; }
#dsh-titlebar .dsh-tb-panel-title { margin: 0 0 6px 10px; font-size: 12px; font-weight: 600; }
#dsh-titlebar .dsh-tb-panel-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-left: 10px; }
#dsh-titlebar .dsh-tb-panel-row + .dsh-tb-panel-row { margin-top: 4px; }
#dsh-titlebar .dsh-tb-panel-muted { color: var(--dsw-alias-label-tertiary, #8a8f98); }
#dsh-titlebar .dsh-tb-panel-action {
  -webkit-app-region: no-drag;
  appearance: none; border: none; cursor: pointer;
  width: 100%; margin-top: 6px; padding: 8px 10px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  border-radius: 9px; background: transparent; color: inherit;
  font: inherit; text-align: left;
  transition: background .12s ease, color .12s ease;
}
#dsh-titlebar .dsh-tb-panel-action:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.08));
}
/* 相邻操作行（打印小票 → 计费设置）纵向间隔与上方信息行一致（4px） */
#dsh-titlebar .dsh-tb-panel-action + .dsh-tb-panel-action {
  margin-top: 4px;
}
#dsh-titlebar .dsh-tb-panel-action.dsh-tb-panel-action-on {
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
#dsh-titlebar .dsh-tb-panel-action-title { display: inline-flex; align-items: center; gap: 6px; min-width: 0; }
#dsh-titlebar .dsh-tb-action-caret {
  display: block; flex: none;
  transition: transform .15s ease;
}
#dsh-titlebar .dsh-tb-panel-action.dsh-tb-panel-action-on .dsh-tb-action-caret {
  transform: rotate(90deg);
}
#dsh-titlebar .dsh-tb-panel-pricing {
  display: none;
  margin-top: 8px;
  padding: 10px;
  border-radius: 10px;
  /* 内嵌面板用主题底色（跟随明暗主题） */
  background: var(--dsw-alias-bg-base, #171b24);
}
#dsh-titlebar .dsh-tb-panel-pricing.dsh-tb-pricing-open { display: block; }
#dsh-titlebar .dsh-tb-price-head {
  display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px;
}
#dsh-titlebar .dsh-tb-price-select,
#dsh-titlebar .dsh-tb-price-input {
  -webkit-app-region: no-drag;
  box-sizing: border-box;
  border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
  border-radius: 8px;
  background: var(--dsw-alias-bg-module-platform, #171b24);
  color: var(--dsw-alias-label-primary, #e8eaf0);
  font: inherit;
  font-variant-numeric: tabular-nums;
}
/* 模型下拉框：圆角 + 去掉原生外观 + 自绘箭头 */
#dsh-titlebar .dsh-tb-price-select {
  appearance: none;
  -webkit-appearance: none;
  min-width: 118px; height: 28px; padding: 0 26px 0 8px;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath d='M2 3.5 L5 6.5 L8 3.5' fill='none' stroke='%23888f98' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}
#dsh-titlebar .dsh-tb-price-grid {
  margin-top: 8px;
  display: grid;
  grid-template-columns: 1.35fr 1fr 1fr;
  gap: 6px;
  align-items: center;
}
#dsh-titlebar .dsh-tb-price-grid span {
  color: var(--dsw-alias-label-tertiary, #8a8f98);
  white-space: nowrap;
}
#dsh-titlebar .dsh-tb-price-input {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  outline: none;
}
#dsh-titlebar .dsh-tb-price-input:focus {
  border-color: #4d6bfe;
  box-shadow: 0 0 0 3px rgba(77,107,254,.16);
}
/* 峰谷时段设置 */
#dsh-titlebar .dsh-tb-price-peak-title {
  margin-top: 10px;
  color: var(--dsw-alias-label-tertiary, #8a8f98);
  font-size: 12px;
}
#dsh-titlebar .dsh-tb-price-peak {
  margin-top: 6px;
  display: flex; align-items: center; gap: 5px; flex-wrap: wrap;
}
#dsh-titlebar .dsh-tb-price-peak + .dsh-tb-price-peak {
  margin-top: 4px;
}
#dsh-titlebar .dsh-tb-peak-input {
  width: 46px; flex: none; text-align: center;
}
#dsh-titlebar .dsh-tb-price-actions {
  margin-top: 10px;
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
#dsh-titlebar .dsh-tb-price-status {
  min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--dsw-alias-label-tertiary, #8a8f98);
}
#dsh-titlebar .dsh-tb-price-buttons { display: inline-flex; align-items: center; gap: 6px; flex: none; }
#dsh-titlebar .dsh-tb-price-btn {
  -webkit-app-region: no-drag;
  appearance: none; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
  cursor: pointer; height: 28px; padding: 0 12px; border-radius: 8px;
  background: transparent; color: var(--dsw-alias-label-secondary, #aeb3bd);
  font: inherit;
}
#dsh-titlebar .dsh-tb-price-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.08));
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
#dsh-titlebar .dsh-tb-price-btn.dsh-tb-price-btn-primary {
  border-color: #4d6bfe;
  background: #4d6bfe;
  color: #fff;
}
#dsh-titlebar .dsh-tb-price-btn.dsh-tb-price-btn-primary:hover {
  background: #5b77ff;
  color: #fff;
}
/* 扣费分类标注：缓存命中用琥珀色区分普通扣费红 / 充值绿 */
#dsh-titlebar .dsh-tb-balance-delta.dsh-tb-delta-hit { color: #e8a33d; }
/* 计费设置状态：保存成功绿色加粗、失败红色加粗，突出反馈 */
#dsh-titlebar .dsh-tb-price-status.dsh-tb-price-status-ok {
  color: #3ba96b;
  font-weight: 600;
}
#dsh-titlebar .dsh-tb-price-status.dsh-tb-price-status-err {
  color: #e45555;
  font-weight: 600;
}
/* 金额变动反馈：仅未命中暴击保留跳动；其余走数字转轮（滚筒）效果 */
#dsh-titlebar .dsh-tb-balance-amount.dsh-tb-balance-miss {
  animation: dsh-tb-balance-miss 1.62s cubic-bezier(.2,.86,.25,1);
}
#dsh-titlebar .dsh-tb-critical-icon { width: 12px; height: 12px; flex: none; display: block; object-fit: contain; }
/* 数字转轮：整段数字向上滚动（旧值上翻、新值入场）；￥ 与数字分离，不参与动画、位置固定 */
#dsh-titlebar .dsh-tb-amt-cur { font-variant-numeric: tabular-nums; }
#dsh-titlebar .dsh-tb-amt-num {
  display: inline-block; overflow: hidden; height: 1em; vertical-align: bottom;
}
#dsh-titlebar .dsh-tb-amt-reel {
  display: flex; flex-direction: column;
  animation: dsh-tb-amt-roll 280ms cubic-bezier(.2,.7,.3,1) forwards;
  will-change: transform;
}
#dsh-titlebar .dsh-tb-amt-reel-cell {
  display: block; height: 1em; line-height: 1; white-space: nowrap;
}
@keyframes dsh-tb-amt-roll {
  from { transform: translateY(0); }
  to { transform: translateY(-50%); }
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
      <span class="dsh-tb-balance-amount" id="dsh-tb-balance-amount"><span class="dsh-tb-amt-cur">￥&#160;</span><span class="dsh-tb-amt-num" id="dsh-tb-amt-num">--</span></span>
      <span class="dsh-tb-balance-season dsh-tb-season-valley" id="dsh-tb-balance-season">谷</span>
      <div class="dsh-tb-balance-panel" id="dsh-tb-balance-panel" role="dialog" aria-label="余额详情">
        <div class="dsh-tb-panel-title">DeepSeek 余额</div>
        <div class="dsh-tb-panel-row"><span class="dsh-tb-panel-muted">可用余额</span><strong id="dsh-tb-panel-total">--</strong></div>
        <div class="dsh-tb-panel-row"><span class="dsh-tb-panel-muted">赠送余额</span><span id="dsh-tb-panel-granted">--</span></div>
        <div class="dsh-tb-panel-row"><span class="dsh-tb-panel-muted">峰谷时段</span><span class="dsh-tb-panel-season dsh-tb-season-valley" id="dsh-tb-panel-season">谷</span></div>
        <button class="dsh-tb-panel-action" id="dsh-tb-receipt-btn" type="button">
          <span class="dsh-tb-panel-action-title">
            <span>打印小票</span>
          </span>
        </button>
        <button class="dsh-tb-panel-action" id="dsh-tb-price-toggle" type="button" aria-expanded="false">
          <span class="dsh-tb-panel-action-title">
            <span>计费设置</span>
            <span class="dsh-tb-panel-muted" id="dsh-tb-price-hint">价格/百万Token</span>
          </span>
          <svg class="dsh-tb-action-caret" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
            <path d="M3 1.5 L6.5 5 L3 8.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="dsh-tb-panel-pricing" id="dsh-tb-pricing-panel">
          <div class="dsh-tb-price-head">
            <span class="dsh-tb-panel-muted">模型</span>
            <select class="dsh-tb-price-select" id="dsh-tb-price-model">
              <option value="deepseek-v4-flash">deepseek-v4-flash</option>
              <option value="deepseek-v4-pro">deepseek-v4-pro</option>
            </select>
          </div>
          <div class="dsh-tb-price-grid">
            <span></span><span>谷</span><span>峰</span>
            <span>缓存命中</span>
            <input class="dsh-tb-price-input" data-rate-scope="offPeak" data-rate-key="cacheHit" inputmode="decimal">
            <input class="dsh-tb-price-input" data-rate-scope="peak" data-rate-key="cacheHit" inputmode="decimal">
            <span>缓存未命中</span>
            <input class="dsh-tb-price-input" data-rate-scope="offPeak" data-rate-key="input" inputmode="decimal">
            <input class="dsh-tb-price-input" data-rate-scope="peak" data-rate-key="input" inputmode="decimal">
            <span>输出</span>
            <input class="dsh-tb-price-input" data-rate-scope="offPeak" data-rate-key="output" inputmode="decimal">
            <input class="dsh-tb-price-input" data-rate-scope="peak" data-rate-key="output" inputmode="decimal">
          </div>
          <div class="dsh-tb-price-peak-title">峰谷时段（DeepSeek 多段，24 小时制）</div>
          <div class="dsh-tb-price-peak">
            <span class="dsh-tb-panel-muted">段1</span>
            <input class="dsh-tb-price-input dsh-tb-peak-input" data-peak-index="0" data-peak-edge="start" inputmode="numeric" title="第 1 段开始（时）">
            <span class="dsh-tb-panel-muted">–</span>
            <input class="dsh-tb-price-input dsh-tb-peak-input" data-peak-index="0" data-peak-edge="end" inputmode="numeric" title="第 1 段结束（时）">
            <span class="dsh-tb-panel-muted">时</span>
          </div>
          <div class="dsh-tb-price-peak">
            <span class="dsh-tb-panel-muted">段2</span>
            <input class="dsh-tb-price-input dsh-tb-peak-input" data-peak-index="1" data-peak-edge="start" inputmode="numeric" title="第 2 段开始（时）">
            <span class="dsh-tb-panel-muted">–</span>
            <input class="dsh-tb-price-input dsh-tb-peak-input" data-peak-index="1" data-peak-edge="end" inputmode="numeric" title="第 2 段结束（时）">
            <span class="dsh-tb-panel-muted">时</span>
          </div>
          <div class="dsh-tb-price-actions">
            <span class="dsh-tb-price-status" id="dsh-tb-price-status">读取中</span>
            <span class="dsh-tb-price-buttons">
              <button class="dsh-tb-price-btn" id="dsh-tb-price-reset" type="button">默认</button>
              <button class="dsh-tb-price-btn dsh-tb-price-btn-primary" id="dsh-tb-price-save" type="button">保存</button>
            </span>
          </div>
        </div>
      </div>
      <span class="dsh-tb-balance-delta" id="dsh-tb-balance-delta">±&#160;0.00</span>
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
  const numSpan = $("dsh-tb-amt-num");
  const delta = $("dsh-tb-balance-delta");
  const season = $("dsh-tb-balance-season");
  const balancePanel = $("dsh-tb-balance-panel");
  const panelTotal = $("dsh-tb-panel-total");
  const panelGranted = $("dsh-tb-panel-granted");
  const panelSeason = $("dsh-tb-panel-season");
  const receiptBtn = $("dsh-tb-receipt-btn");
  const priceToggle = $("dsh-tb-price-toggle");
  const priceHint = $("dsh-tb-price-hint");
  const pricingPanel = $("dsh-tb-pricing-panel");
  const priceModel = $("dsh-tb-price-model");
  const priceStatus = $("dsh-tb-price-status");
  const priceReset = $("dsh-tb-price-reset");
  const priceSave = $("dsh-tb-price-save");
  const priceInputs = Array.from(bar.querySelectorAll(".dsh-tb-price-input:not(.dsh-tb-peak-input)"));
  const peakInputs = Array.from(bar.querySelectorAll(".dsh-tb-peak-input"));
  let balanceValue = null;
  let remoteBalanceValue = null;
  let chargeSeq = 0;
  let chargeSeeded = false;
  let chargeTimer = null;
  let balanceTimer = null;
  let deltaTimer = null;
  let chargePollInFlight = false;
  let pricingOpen = false;
  let priceTable = null;
  let priceStatusTimer = null;

  const DEFAULT_PRICE_TABLE = {
    version: "2026-08-17",
    peakHours: [[9, 12], [14, 18]],
    models: {
      "deepseek-v4-flash": {
        offPeak: { input: 1.5, cacheHit: 0.05, output: 4.5 },
        peak: { input: 3, cacheHit: 0.1, output: 9 },
      },
      "deepseek-v4-pro": {
        offPeak: { input: 4.5, cacheHit: 0.15, output: 13.5 },
        peak: { input: 9, cacheHit: 0.3, output: 27 },
      },
    },
  };
  const clonePriceTable = (table) => JSON.parse(JSON.stringify(table));

  const fmtMoney = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? `￥\u00a0${n.toFixed(2)}` : "￥\u00a0--";
  };
  const fmtDelta = (value, sign) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "--";
    // 缓存命中金额极小，保留 4 位小数，避免显示成 -0.00 而“看不见”
    const text = Math.abs(n) < 0.01 ? n.toFixed(4) : n.toFixed(2);
    return `${sign}${text}`;
  };
  /** 峰谷判断跟随计费设置里保存的时段（未加载/未保存时用默认时段）。 */
  const isPeakNow = () => {
    const hourText = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Shanghai", hour: "2-digit", hour12: false,
    }).formatToParts(new Date()).find((part) => part.type === "hour")?.value;
    const hour = Number(hourText);
    const peaks = Array.isArray(priceTable && priceTable.peakHours) && priceTable.peakHours.length > 0
      ? priceTable.peakHours
      : DEFAULT_PRICE_TABLE.peakHours;
    return peaks.some(([start, end]) => hour >= Number(start) && hour < Number(end));
  };
  const updateSeason = () => {
    const peak = isPeakNow();
    season.textContent = peak ? "峰" : "谷";
    season.classList.toggle("dsh-tb-season-peak", peak);
    season.classList.toggle("dsh-tb-season-valley", !peak);
    panelSeason.textContent = peak ? "峰" : "谷";
    panelSeason.classList.toggle("dsh-tb-season-peak", peak);
    panelSeason.classList.toggle("dsh-tb-season-valley", !peak);
  };
  const criticalIcon = () => `
    <img class="dsh-tb-critical-icon" src="${CRITICAL_ICON_DATA}" alt="" aria-hidden="true">`;
  /** 扣费提示停留时长（原 1800ms，现定为 3300ms）。 */
  const DELTA_HOLD_MS = 3300;
  /** 连续扣费提示的错峰间隔：同一批事件各自获得展示机会，避免被覆盖。 */
  const DELTA_QUEUE_GAP_MS = 220;
  /** 展示队列上限：超出丢弃最旧（余额扣减已发生，仅提示展示被跳过）。 */
  const DELTA_QUEUE_MAX = 20;
  const deltaQueue = [];
  let deltaQueueTimer = null;
  /** 用 breakdown 识别本次扣费类型：miss（未命中暴击）/ hit（缓存命中）/ output / normal。 */
  const chargeKindOf = (event) => {
    const breakdown = event && event.breakdown ? event.breakdown : null;
    let kind = event && event.damageKind === "miss" ? "miss" : "normal";
    if (breakdown) {
      const hit = Number(breakdown.cacheHit && breakdown.cacheHit.cost) || 0;
      const miss = Number(breakdown.cacheMiss && breakdown.cacheMiss.cost) || 0;
      const output = Number(breakdown.output && breakdown.output.cost) || 0;
      if (hit > 0 || miss > 0 || output > 0) {
        if (miss >= hit && miss >= output) kind = "miss";
        else if (hit >= output) kind = "hit";
        else kind = "output";
      }
    }
    return kind;
  };
  const showDelta = (event, sign = "-") => {
    const kind = chargeKindOf(event);
    // 金额反馈：仅未命中暴击加跳动动画；其余由 renderBalance 走数字转轮
    amount.classList.remove("dsh-tb-balance-miss");
    if (kind === "miss" && sign === "-") {
      void amount.offsetWidth;
      amount.classList.add("dsh-tb-balance-miss");
    }
    const colorClass = sign === "+" ? "dsh-tb-delta-green" : kind === "hit" ? "dsh-tb-delta-hit" : "dsh-tb-delta-red";
    delta.className = `dsh-tb-balance-delta ${colorClass}`;
    const parts = [];
    if (kind === "miss" && sign === "-") parts.push(criticalIcon());
    parts.push(`<span>${fmtDelta(Number(event && event.cost), sign)}</span>`);
    delta.innerHTML = parts.join("");
    clearTimeout(deltaTimer);
    deltaTimer = setTimeout(() => {
      delta.textContent = "±\u00a00.00";
      delta.className = "dsh-tb-balance-delta";
    }, DELTA_HOLD_MS);
  };
  /** 将一次扣费提示加入展示队列，逐条错峰播放。 */
  const enqueueDelta = (event, sign = "-") => {
    if (deltaQueue.length >= DELTA_QUEUE_MAX) deltaQueue.shift();
    deltaQueue.push({ event, sign });
    if (deltaQueueTimer === null) drainDeltaQueue();
  };
  const drainDeltaQueue = () => {
    const next = deltaQueue.shift();
    if (next === undefined) {
      deltaQueueTimer = null;
      return;
    }
    showDelta(next.event, next.sign);
    deltaQueueTimer = setTimeout(drainDeltaQueue, DELTA_QUEUE_GAP_MS);
  };
  /** 上次渲染的余额文本（用于对比哪些数字需要滚动）。 */
  let lastAmountText = null;
  const escAmountChar = (ch) => {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    return ch;
  };
  /** 整段数字滚筒：旧值在上、新值在下，向上滚动一格（纯 CSS 动画，￥ 不参与）。 */
  const buildOdometer = (oldText, newText) => (
    `<span class="dsh-tb-amt-reel"><span class="dsh-tb-amt-reel-cell">${escAmountChar(oldText)}</span><span class="dsh-tb-amt-reel-cell">${escAmountChar(newText)}</span></span>`
  );
  const renderBalance = (mode = "none") => {
    const shown = balanceValue === null ? NaN : balanceValue;
    const numText = Number.isFinite(shown) ? shown.toFixed(2) : "--";
    panelTotal.textContent = fmtMoney(shown);
    if (mode === "miss") {
      // 未命中暴击：纯文本 + 跳动动画（由 showDelta 加类）
      numSpan.textContent = numText;
      lastAmountText = numText;
      return;
    }
    if (mode === "reel" && lastAmountText !== null && lastAmountText !== numText) {
      numSpan.innerHTML = buildOdometer(lastAmountText, numText);
      lastAmountText = numText;
      return;
    }
    numSpan.textContent = numText;
    lastAmountText = numText;
  };
  /**
  * 合并调度余额渲染：同一批事件/短时间内的多次变动只滚动一次，
  * 避免连续重建 DOM、反复重启滚筒动画导致的卡顿。
  * 批内只要含未命中暴击就按 miss 渲染（跳动），否则走转轮。
  */
  let balanceRenderTimer = null;
  let balanceRenderMode = "none";
  const scheduleBalanceRender = (mode) => {
    if (mode === "miss") balanceRenderMode = "miss";
    else if (balanceRenderMode !== "miss") balanceRenderMode = mode;
    if (balanceRenderTimer !== null) return;
    balanceRenderTimer = setTimeout(() => {
      balanceRenderTimer = null;
      renderBalance(balanceRenderMode);
    }, 60);
  };
  const setPriceStatus = (text, opts = {}) => {
    priceStatus.textContent = text;
    priceStatus.classList.toggle("dsh-tb-price-status-ok", !!opts.ok);
    priceStatus.classList.toggle("dsh-tb-price-status-err", !!opts.err);
    // 成功/失败提示停留 3.5s 后恢复弱化样式，避免长期占据注意力
    if (priceStatusTimer !== null) {
      clearTimeout(priceStatusTimer);
      priceStatusTimer = null;
    }
    if (opts.ok || opts.err) {
      priceStatusTimer = setTimeout(() => {
        priceStatus.classList.remove("dsh-tb-price-status-ok", "dsh-tb-price-status-err");
        priceStatusTimer = null;
      }, 3500);
    }
  };
  const activePriceModel = () => priceModel.value || "deepseek-v4-flash";
  const ensurePriceTable = () => {
    if (priceTable === null) priceTable = clonePriceTable(DEFAULT_PRICE_TABLE);
    for (const model of Object.keys(DEFAULT_PRICE_TABLE.models)) {
      if (!priceTable.models) priceTable.models = {};
      if (!priceTable.models[model]) priceTable.models[model] = clonePriceTable(DEFAULT_PRICE_TABLE.models[model]);
      for (const scope of ["offPeak", "peak"]) {
        if (!priceTable.models[model][scope]) priceTable.models[model][scope] = {};
        for (const key of ["input", "cacheHit", "output"]) {
          const value = Number(priceTable.models[model][scope][key]);
          if (!Number.isFinite(value) || value < 0) {
            priceTable.models[model][scope][key] = DEFAULT_PRICE_TABLE.models[model][scope][key];
          }
        }
      }
    }
    if (!Array.isArray(priceTable.peakHours)) priceTable.peakHours = clonePriceTable(DEFAULT_PRICE_TABLE.peakHours);
    if (typeof priceTable.version !== "string") priceTable.version = DEFAULT_PRICE_TABLE.version;
  };
  const renderPriceForm = () => {
    ensurePriceTable();
    const model = activePriceModel();
    const modelTable = priceTable.models[model] || DEFAULT_PRICE_TABLE.models[model];
    for (const input of priceInputs) {
      const scope = input.dataset.rateScope;
      const key = input.dataset.rateKey;
      input.value = String(modelTable[scope][key]);
    }
    // 峰谷时段（DeepSeek 多段，如 [[9,12],[14,18]]）；按段覆盖已保存值，缺段用默认补足
    const savedPeaks = Array.isArray(priceTable.peakHours) && priceTable.peakHours.length > 0
      ? priceTable.peakHours
      : DEFAULT_PRICE_TABLE.peakHours;
    const peakHours = DEFAULT_PRICE_TABLE.peakHours.map((pair, index) => {
      const saved = savedPeaks[index] || pair;
      return [Number(saved[0]), Number(saved[1])];
    });
    for (const input of peakInputs) {
      const idx = Number(input.dataset.peakIndex);
      const edge = input.dataset.peakEdge;
      const pair = peakHours[idx] || [];
      input.value = String(edge === "start" ? pair[0] : pair[1]);
    }
  };
  const readPriceForm = () => {
    ensurePriceTable();
    const model = activePriceModel();
    for (const input of priceInputs) {
      const scope = input.dataset.rateScope;
      const key = input.dataset.rateKey;
      const value = Number(input.value.trim());
      if (!Number.isFinite(value) || value < 0) throw new Error("价格必须是非负数字");
      priceTable.models[model][scope][key] = value;
    }
    // 读取峰谷时段输入（0-23 整数小时，start < end）；以当前已保存时段为底，未编辑段不重置
    const savedPeaks = Array.isArray(priceTable.peakHours) && priceTable.peakHours.length > 0
      ? priceTable.peakHours
      : DEFAULT_PRICE_TABLE.peakHours;
    const peakHours = DEFAULT_PRICE_TABLE.peakHours.map((pair, index) => {
      const saved = savedPeaks[index] || pair;
      return [Number(saved[0]), Number(saved[1])];
    });
    for (const input of peakInputs) {
      const idx = Number(input.dataset.peakIndex);
      const edge = input.dataset.peakEdge;
      const value = Number(input.value.trim());
      if (!Number.isInteger(value) || value < 0 || value > 23) throw new Error("峰谷时段必须是 0-23 的整数小时");
      peakHours[idx][edge === "start" ? 0 : 1] = value;
    }
    for (const [start, end] of peakHours) {
      if (start >= end) throw new Error("峰谷时段开始必须小于结束");
    }
    priceTable.version = "desktop-custom";
    priceTable.peakHours = peakHours;
    return priceTable;
  };
  const loadPricing = async () => {
    try {
      const res = await fetch("/api/token-monitor/pricing", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      priceTable = await res.json();
      renderPriceForm();
      setPriceStatus("已读取");
    } catch {
      priceTable = clonePriceTable(DEFAULT_PRICE_TABLE);
      renderPriceForm();
      setPriceStatus("读取失败，使用默认值", { err: true });
    }
    updateSeason();
  };
  const savePricing = async (table) => {
    const res = await fetch("/api/token-monitor/pricing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(table),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    priceTable = await res.json();
    renderPriceForm();
  };
  const setPricingOpen = (open) => {
    pricingOpen = open;
    pricingPanel.classList.toggle("dsh-tb-pricing-open", open);
    priceToggle.classList.toggle("dsh-tb-panel-action-on", open);
    priceToggle.setAttribute("aria-expanded", String(open));
    priceHint.textContent = open ? "点击收起" : "价格/百万Token";
    if (open) void loadPricing();
  };
  receiptBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openReceipt();
  });
  priceToggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPricingOpen(!pricingOpen);
  });
  for (const input of priceInputs) {
    input.addEventListener("input", () => {
      ensurePriceTable();
      const value = Number(input.value.trim());
      if (!Number.isFinite(value) || value < 0) return;
      priceTable.models[activePriceModel()][input.dataset.rateScope][input.dataset.rateKey] = value;
    });
  }
  priceModel.addEventListener("change", () => renderPriceForm());
  priceReset.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    priceTable = clonePriceTable(DEFAULT_PRICE_TABLE);
    renderPriceForm();
    try {
      setPriceStatus("保存中");
      await savePricing(priceTable);
      setPriceStatus("已恢复默认，立即生效", { ok: true });
      updateSeason();
    } catch {
      setPriceStatus("保存失败", { err: true });
    }
  });
  priceSave.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      setPriceStatus("保存中");
      await savePricing(readPriceForm());
      setPriceStatus("✓ 已保存，立即生效", { ok: true });
      updateSeason();
    } catch (error) {
      setPriceStatus(error instanceof Error ? error.message : "保存失败", { err: true });
    }
  });
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
          // 余额由服务端按「官方余额 - 待扣扣费」统一计算（持久化，重启不丢），
          // 这里只展示扣费提示，不再本地递减。
          enqueueDelta(event, "-");
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
        numSpan.textContent = "--";
        lastAmountText = "--";
        panelTotal.textContent = "--";
        panelGranted.textContent = "--";
        balance.title = "DeepSeek 账户余额同步中…";
        return;
      }
      // 展示余额 = 官方余额 - 官方尚未反映的本地扣费（pendingCost 由服务端持久化计算），允许为负
      const next = Number(data.totalBalance) - (Number(data.pendingCost) || 0);
      const remoteDelta = remoteBalanceValue === null ? 0 : next - remoteBalanceValue;
      remoteBalanceValue = next;
      if (balanceValue === null || Math.abs(remoteDelta) > 1e-9) balanceValue = next;
      scheduleBalanceRender("reel");
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
  // 启动即拉取价格表：峰谷指示（峰/谷）与面板表单跟随已保存的时段
  void loadPricing();
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

/**
 * 会话小票弹窗：超市小票风格（米白纸面 + 等宽字体 + 灰色虚线分割）。
 * 由「打印小票」按钮打开，数据来自 /api/token-monitor/receipt。
 */
const RECEIPT_DIALOG_CSS = `
#dsh-receipt-dialog {
  position: fixed; inset: 0; z-index: 2147483647;
  display: none; align-items: center; justify-content: center;
  background: rgba(8, 10, 16, 0.35);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  font-family: "Courier New", ui-monospace, Consolas, "Microsoft YaHei", monospace;
}
#dsh-receipt-dialog.dsh-rcpt-open { display: flex; }
.dsh-rcpt-card {
  width: 320px; max-width: calc(100vw - 40px);
  max-height: calc(100vh - 80px); overflow-y: auto;
  background: var(--dsw-alias-bg-module-platform, #171b24);
  color: var(--dsw-alias-label-primary, #e8eaf0);
  border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.28));
  border-radius: 6px;
  box-shadow: 0 14px 44px rgba(0,0,0,.38);
}
/* 顶部票据锯齿：模仿撕票边缘，颜色跟随主题 */
.dsh-rcpt-card:before {
  content: ""; display: block; height: 6px;
  background:
    linear-gradient(-45deg, transparent 70%, var(--dsw-alias-bg-module-platform, #171b24) 0) 0 0 / 8px 6px repeat-x,
    linear-gradient(45deg, transparent 70%, var(--dsw-alias-bg-module-platform, #171b24) 0) 4px 0 / 8px 6px repeat-x;
  border-bottom: 1px dashed var(--dsw-alias-border-l2, rgba(128,128,128,.28));
}
.dsh-rcpt-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px 6px;
}
.dsh-rcpt-title {
  font-size: 15px; font-weight: 700; letter-spacing: 3px;
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
.dsh-rcpt-close {
  -webkit-app-region: no-drag;
  appearance: none; border: none; background: transparent; cursor: pointer;
  color: var(--dsw-alias-label-tertiary, #8a8f98); width: 24px; height: 24px; border-radius: 6px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 14px;
}
.dsh-rcpt-close:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.08)); color: var(--dsw-alias-label-primary, #e8eaf0); }
.dsh-rcpt-body { padding: 2px 16px 14px; font-size: 12px; line-height: 1.75; color: var(--dsw-alias-label-secondary, #b4b9c2); }
.dsh-rcpt-brand {
  text-align: center; font-weight: 700; letter-spacing: 1px;
  font-size: 13px; margin-bottom: 6px;
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
.dsh-rcpt-line { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.dsh-rcpt-line > span:last-child:not(.dsh-rcpt-id) { text-align: right; white-space: nowrap; }
/* 会话ID 允许换行完整显示，不截断 */
.dsh-rcpt-id {
  max-width: 64%; word-break: break-all; overflow-wrap: anywhere;
  white-space: normal; text-align: right;
}
.dsh-rcpt-sep { border-top: 1px dashed var(--dsw-alias-border-l2, rgba(128,128,128,.28)); margin: 8px 0; }
.dsh-rcpt-model { font-weight: 700; margin: 4px 0 2px; color: var(--dsw-alias-label-primary, #e8eaf0); }
.dsh-rcpt-model-amount { font-weight: 700; color: var(--dsw-alias-label-primary, #e8eaf0); }
.dsh-rcpt-total { font-weight: 700; color: var(--dsw-alias-label-primary, #e8eaf0); }
.dsh-rcpt-thanks {
  text-align: center; margin-top: 10px;
  font-size: 13px; font-weight: 700; letter-spacing: 6px;
  color: var(--dsw-alias-label-primary, #e8eaf0);
}
.dsh-rcpt-loading { text-align: center; color: var(--dsw-alias-label-tertiary, #8a8f98); padding: 14px 0; }
.dsh-rcpt-actions {
  display: flex; justify-content: center; gap: 8px;
  padding: 0 16px 12px;
}
.dsh-rcpt-btn {
  -webkit-app-region: no-drag;
  appearance: none; border: 1px solid var(--dsw-alias-border-l2, rgba(128,128,128,.3)); cursor: pointer;
  height: 28px; padding: 0 18px; border-radius: 6px;
  background: transparent; color: var(--dsw-alias-label-secondary, #b4b9c2);
  font: 600 12px/1 "Courier New", ui-monospace, Consolas, "Microsoft YaHei", monospace;
}
.dsh-rcpt-btn:hover { background: var(--dsw-alias-interactive-bg-hover, rgba(255,255,255,.07)); color: var(--dsw-alias-label-primary, #e8eaf0); }
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

// ---------- 会话小票弹窗 ----------

/** 整数千分位格式化。 */
function fmtReceiptInt(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "0";
}
/** 小票金额：小金额保留 4 位小数。 */
function fmtReceiptCost(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "--";
  return Math.abs(n) < 0.01 ? `¥${n.toFixed(4)}` : `¥${n.toFixed(2)}`;
}
/** 小票百分比：保留 1 位小数。 */
function fmtReceiptPercent(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : "0.0%";
}
/** 时长（毫秒）→ 人读文本。 */
function fmtReceiptDuration(ms) {
  const n = Number(ms);
  if (!Number.isFinite(n) || n < 0) return "—";
  const totalSeconds = Math.max(0, Math.round(n / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}小时${minutes}分`;
  if (minutes > 0) return `${minutes}分${seconds}秒`;
  return `${seconds}秒`;
}

function ensureReceiptDialog() {
  let dlg = document.getElementById("dsh-receipt-dialog");
  if (dlg) return dlg;
  const style = document.createElement("style");
  style.id = "dsh-receipt-dialog-style";
  style.textContent = RECEIPT_DIALOG_CSS;
  document.head.appendChild(style);
  dlg = document.createElement("div");
  dlg.id = "dsh-receipt-dialog";
  dlg.innerHTML = `
    <div class="dsh-rcpt-card">
      <div class="dsh-rcpt-head">
        <div class="dsh-rcpt-title">会话小票</div>
        <button class="dsh-rcpt-close" id="dsh-rcpt-close" title="关闭" type="button">✕</button>
      </div>
      <div class="dsh-rcpt-body" id="dsh-rcpt-body"></div>
      <div class="dsh-rcpt-actions">
        <button class="dsh-rcpt-btn" id="dsh-rcpt-close-btn" type="button">关闭</button>
      </div>
    </div>`;
  document.body.appendChild(dlg);
  const close = () => dlg.classList.remove("dsh-rcpt-open");
  dlg.querySelector("#dsh-rcpt-close").addEventListener("click", close);
  dlg.querySelector("#dsh-rcpt-close-btn").addEventListener("click", close);
  dlg.addEventListener("pointerdown", (event) => {
    if (event.target === dlg) close();
  });
  return dlg;
}

function renderReceipt(data) {
  const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const issued = new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "short", timeStyle: "medium", hour12: false,
  }).format(new Date(data.issuedAt));
  const lines = [];
  lines.push('<div class="dsh-rcpt-brand">DeepSeek小票清单</div>');
  lines.push('<div class="dsh-rcpt-line"><span>会话ID</span><span class="dsh-rcpt-id" title="' + esc(data.sessionId) + '">' + esc(data.sessionId) + "</span></div>");
  lines.push(`<div class="dsh-rcpt-line"><span>出票时间</span><span>${esc(issued)}</span></div>`);
  lines.push('<div class="dsh-rcpt-sep"></div>');
  for (const model of data.models || []) {
    lines.push(`<div class="dsh-rcpt-model">${esc(model.model)}</div>`);
    lines.push(`<div class="dsh-rcpt-line"><span>调用次数</span><span>${fmtReceiptInt(model.calls)}</span></div>`);
    lines.push(`<div class="dsh-rcpt-line"><span>输入 Token</span><span>${fmtReceiptInt(model.inputTokens)}</span></div>`);
    lines.push(`<div class="dsh-rcpt-line"><span>输出 Token</span><span>${fmtReceiptInt(model.outputTokens)}</span></div>`);
    lines.push(`<div class="dsh-rcpt-line"><span>缓存 Token</span><span>${fmtReceiptInt((model.cacheReadTokens || 0) + (model.cacheWriteTokens || 0))}</span></div>`);
    lines.push(`<div class="dsh-rcpt-line"><span>推理 Token</span><span>${fmtReceiptInt(model.reasoningTokens)}</span></div>`);
    lines.push(`<div class="dsh-rcpt-line dsh-rcpt-model-amount"><span>金额</span><span>${fmtReceiptCost(model.cost)}</span></div>`);
  }
  lines.push('<div class="dsh-rcpt-sep"></div>');
  lines.push(`<div class="dsh-rcpt-line dsh-rcpt-total"><span>合计调用次数</span><span>${fmtReceiptInt(data.totals && data.totals.calls)}</span></div>`);
  lines.push(`<div class="dsh-rcpt-line dsh-rcpt-total"><span>合计 Token</span><span>${fmtReceiptInt(data.totals && data.totals.tokens)}</span></div>`);
  lines.push(`<div class="dsh-rcpt-line"><span>模型耗时</span><span>${fmtReceiptDuration(data.llmMs)}</span></div>`);
  lines.push(`<div class="dsh-rcpt-line"><span>会话跨度</span><span>${fmtReceiptDuration(data.spanMs)}</span></div>`);
  lines.push(`<div class="dsh-rcpt-line"><span>缓存命中</span><span>${fmtReceiptPercent(data.totals && data.totals.cacheHitRate)} · ${fmtReceiptCost(data.totals && data.totals.cacheHitCost)}</span></div>`);
  lines.push('<div class="dsh-rcpt-sep"></div>');
  lines.push(`<div class="dsh-rcpt-line dsh-rcpt-total"><span>合计金额</span><span>${fmtReceiptCost(data.totals && data.totals.cost)}</span></div>`);
  lines.push(`<div class="dsh-rcpt-line"><span>其中高峰时段费用</span><span>${fmtReceiptCost(data.totals && data.totals.peakCost)}</span></div>`);
  lines.push('<div class="dsh-rcpt-sep"></div>');
  lines.push('<div class="dsh-rcpt-thanks">-谢谢惠顾-</div>');
  return lines.join("");
}

function openReceipt() {
  const dlg = ensureReceiptDialog();
  const body = dlg.querySelector("#dsh-rcpt-body");
  body.innerHTML = '<div class="dsh-rcpt-loading">小票生成中…</div>';
  dlg.classList.add("dsh-rcpt-open");
  // 优先打印当前正在查看的会话（由客户端插件写入 DOM）；无则交给服务端自动定位
  const activeSession = document.body.dataset.dshActiveSession || "";
  const url = activeSession !== ""
    ? `/api/token-monitor/receipt?sessionId=${encodeURIComponent(activeSession)}`
    : "/api/token-monitor/receipt";
  fetch(url, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      body.innerHTML = renderReceipt(data);
    })
    .catch((error) => {
      const message = String(error && error.message ? error.message : error);
      body.innerHTML = `<div class="dsh-rcpt-loading">${message === "HTTP 404" ? "暂无会话数据，请先发起对话" : `小票生成失败：${message}`}</div>`;
    });
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
