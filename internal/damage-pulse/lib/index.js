import z from "@deepseek-ai/schemastery";
import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
import { z as z$1 } from "zod";
import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
//#region plugins/dsh-token-monitor/src/pricing.ts
/** 2026-08-17 起生效的峰谷价格（单位：元 / 百万 tokens）。 */
const PRICE_TABLE = {
	version: "2026-08-17",
	peakHours: [[9, 12], [14, 18]],
	models: {
		"deepseek-v4-flash": {
			offPeak: {
				input: 1.5,
				cacheHit: .05,
				output: 4.5
			},
			peak: {
				input: 3,
				cacheHit: .1,
				output: 9
			}
		},
		"deepseek-v4-pro": {
			offPeak: {
				input: 4.5,
				cacheHit: .15,
				output: 13.5
			},
			peak: {
				input: 9,
				cacheHit: .3,
				output: 27
			}
		}
	}
};
/**
* 2026-08-17 00:00（北京时间）前的旧价格：统一价，无峰谷。
* 峰值/谷值填同一组价格 + 空 peakHours，使 `isPeakHour` 恒为假、始终按 offPeak 计价。
*/
const LEGACY_PRICE_TABLE = {
	version: "legacy-before-2026-08-17",
	peakHours: [],
	models: {
		"deepseek-v4-flash": {
			offPeak: {
				input: 1,
				cacheHit: .02,
				output: 2
			},
			peak: {
				input: 1,
				cacheHit: .02,
				output: 2
			}
		},
		"deepseek-v4-pro": {
			offPeak: {
				input: 3,
				cacheHit: .025,
				output: 6
			},
			peak: {
				input: 3,
				cacheHit: .025,
				output: 6
			}
		}
	}
};
/**
* 峰谷新价格生效时刻：2026-08-17 00:00 北京时间 = 2026-08-16 16:00 UTC。
* 此前的调用按旧统一价计价，此后按峰谷价计价。
*/
const PEAK_PRICING_START = Date.UTC(2026, 7, 16, 16, 0, 0);
/** 按时间戳选择价格表：8-17 前用旧统一价，之后用（可配置的）峰谷价。 */
function selectPriceTable(ts, table = PRICE_TABLE) {
	return ts < PEAK_PRICING_START ? LEGACY_PRICE_TABLE : table;
}
/** 未命中价格表时的安全默认价（取 flash 高峰价，偏高不偏少）。 */
const FALLBACK = {
	input: 3,
	cacheHit: .1,
	output: 9
};
/** 取时间戳对应的北京时间小时（0-23）；解析失败返回 -1。 */
function beijingHour(ts) {
	const hour = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Shanghai",
		hour: "2-digit",
		hour12: false
	}).formatToParts(new Date(ts)).find((p) => p.type === "hour")?.value;
	return hour === void 0 ? -1 : Number(hour);
}
/** 判断时间戳是否落在高峰时段（半开区间 [start, end)）。 */
function isPeakHour(ts, peakHours) {
	const hour = beijingHour(ts);
	return peakHours.some(([start, end]) => hour >= start && hour < end);
}
/**
* 归一化模型名后查价：直接命中优先，否则用前缀匹配，
* 使 `deepseek-v4-flash-0731` 归到 `deepseek-v4-flash`。
*/
function resolveModelPrice(model, table) {
	const direct = table.models[model];
	if (direct !== void 0) return direct;
	for (const [name, price] of Object.entries(table.models)) if (model.startsWith(name)) return price;
}
/**
* 按 (token 数, 模型, 时间戳) 计算一次调用的费用。
* 缓存命中（cacheReadTokens）按 cacheHit 价；缓存写入（cacheWriteTokens）并入缓存未命中价。
*/
function priceUsage(inputTokens, cacheReadTokens, cacheWriteTokens, outputTokens, model, ts, table = PRICE_TABLE) {
	const active = selectPriceTable(ts, table);
	const resolved = resolveModelPrice(model, active);
	const peak = isPeakHour(ts, active.peakHours);
	const rate = peak ? resolved?.peak ?? FALLBACK : resolved?.offPeak ?? FALLBACK;
	const costInput = inputTokens / 1e6 * rate.input;
	const costCacheRead = cacheReadTokens / 1e6 * rate.cacheHit;
	const costCacheWrite = cacheWriteTokens / 1e6 * rate.input;
	const costCache = costCacheRead + costCacheWrite;
	const costOutput = outputTokens / 1e6 * rate.output;
	return {
		costInput,
		costCache,
		costCacheRead,
		costCacheWrite,
		costOutput,
		cost: costInput + costCache + costOutput,
		peak
	};
}
//#endregion
//#region plugins/dsh-token-monitor/src/charge.ts
/** 环形缓冲区上限：保留最近 500 次扣费，避免长期运行无限增长。 */
const MAX_EVENTS = 500;
const events = [];
let seqCounter = 0;
/** 记录一次扣费（cost 为正数金额）。 */
function recordCharge(cost, timestamp, damageKind, breakdown) {
	events.push({
		seq: ++seqCounter,
		cost,
		timestamp,
		damageKind,
		breakdown
	});
	if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
}
/** 返回 seq 严格大于 since 的扣费事件（按 seq 升序）。 */
function chargesSince(since) {
	if (since >= seqCounter) return [];
	return events.filter((event) => event.seq > since);
}
/** 当前最大 seq（Client 用它初始化拉取游标）。 */
function currentChargeSeq() {
	return seqCounter;
}
//#endregion
//#region plugins/dsh-token-monitor/src/collector.ts
/** 把一条 assistant/message 的 usage 转成 UsageRecord。 */
function buildRecord(sessionId, turn, step, timestamp, provider, model, usage, priceTable) {
	const inputTokens = usage.inputTokens;
	const cacheReadTokens = usage.cacheReadTokens ?? 0;
	const cacheWriteTokens = usage.cacheWriteTokens ?? 0;
	const outputTokens = usage.outputTokens;
	const breakdown = priceUsage(inputTokens, cacheReadTokens, cacheWriteTokens, outputTokens, model, timestamp, priceTable);
	return {
		sessionId,
		turn,
		step,
		timestamp,
		provider,
		model,
		inputTokens,
		cacheReadTokens,
		cacheWriteTokens,
		outputTokens,
		reasoningTokens: usage.reasoningTokens ?? 0,
		costInput: breakdown.costInput,
		costCache: breakdown.costCache,
		costCacheRead: breakdown.costCacheRead,
		costCacheWrite: breakdown.costCacheWrite,
		costOutput: breakdown.costOutput,
		cost: breakdown.cost,
		peak: breakdown.peak
	};
}
/** 挂载采集器：监听 session/event，累计每次模型调用的 token 与金额。 */
function attachCollector(ctx, storage, priceTable) {
	ctx.on("session/event", (session, event) => {
		if (event.type !== "assistant/message") return;
		const usage = event.data.usage;
		if (usage === void 0) return;
		const source = event.data.message.source;
		if (source.kind !== "model") return;
		const record = buildRecord(session.id, event.data.turn, event.data.step, event.time, source.provider, source.model, usage, priceTable);
		storage.add(record);
		const damageKind = record.inputTokens > 0 || record.cacheWriteTokens > 0 ? "miss" : "normal";
		recordCharge(record.cost, record.timestamp, damageKind, {
			cacheHit: {
				tokens: record.cacheReadTokens,
				cost: record.costCacheRead
			},
			cacheMiss: {
				tokens: record.inputTokens + record.cacheWriteTokens,
				cost: record.costInput + record.costCacheWrite
			},
			output: {
				tokens: record.outputTokens,
				cost: record.costOutput
			}
		});
		session.append("token-usage/record", { record });
	});
}
//#endregion
//#region plugins/dsh-token-monitor/src/balance-selection.ts
function parseAmount(value, field) {
	const amount = Number(value);
	if (!Number.isFinite(amount) || amount < 0) throw new Error(`balance response has invalid ${field}`);
	return amount;
}
function parseEntry(info) {
	const currency = info.currency?.trim().toUpperCase();
	if (currency === void 0 || currency.length === 0) throw new Error("balance response has invalid currency");
	return {
		currency,
		totalBalance: parseAmount(info.total_balance, "total_balance"),
		grantedBalance: parseAmount(info.granted_balance, "granted_balance"),
		toppedUpBalance: parseAmount(info.topped_up_balance, "topped_up_balance")
	};
}
/**
* DeepSeek may return several currencies in arbitrary order. Select a funded
* entry deterministically instead of trusting balance_infos[0]. Malformed
* secondary entries are ignored while at least one valid entry remains.
*/
function selectBalanceInfo(response) {
	const entries = [];
	for (const info of response.balance_infos ?? []) try {
		entries.push(parseEntry(info));
	} catch {}
	if (entries.length === 0) throw new Error("balance response has no valid balance_infos");
	entries.sort((left, right) => {
		const funded = Number(right.totalBalance > 0) - Number(left.totalBalance > 0);
		if (funded !== 0) return funded;
		const preferredCurrency = Number(right.currency === "CNY") - Number(left.currency === "CNY");
		if (preferredCurrency !== 0) return preferredCurrency;
		const total = right.totalBalance - left.totalBalance;
		if (total !== 0) return total;
		return left.currency.localeCompare(right.currency);
	});
	return entries[0];
}
//#endregion
//#region plugins/dsh-token-monitor/src/balance.ts
const DEEPSEEK_API_KEY = credentialRef("DEEPSEEK_API_KEY");
const BALANCE_URL = "https://api.deepseek.com/user/balance";
/** 从 ctx.credentials 解析 DeepSeek API key（每操作重新解析，遵循凭据热更新约定）。 */
async function resolveApiKey(ctx) {
	return (await ctx.credentials.resolve(DEEPSEEK_API_KEY))?.value;
}
/** 查询一次 DeepSeek 账户余额。 */
async function fetchBalance(apiKey) {
	const res = await fetch(BALANCE_URL, {
		headers: {
			Authorization: `Bearer ${apiKey}`,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(1e4)
	});
	if (!res.ok) throw new Error(`balance HTTP ${res.status}`);
	const json = await res.json();
	return {
		...selectBalanceInfo(json),
		isAvailable: json.is_available !== false,
		updatedAt: Date.now()
	};
}
/** 余额服务：定时轮询 + 缓存最新值。 */
var BalanceService = class {
	ctx;
	pollMs;
	latest;
	timer;
	warnedMissingKey = false;
	lastLoggedTotal;
	constructor(ctx, pollMs = 6e4) {
		this.ctx = ctx;
		this.pollMs = pollMs;
	}
	/** 查询并缓存最新余额；失败只告警不抛。 */
	async refresh() {
		const apiKey = await resolveApiKey(this.ctx);
		if (apiKey === void 0) {
			if (!this.warnedMissingKey) {
				console.warn("[dsh-damage-pulse] 未配置 DEEPSEEK_API_KEY，余额卡片将显示未配置态");
				this.warnedMissingKey = true;
			}
			return;
		}
		try {
			const next = await fetchBalance(apiKey);
			this.latest = next;
			if (this.lastLoggedTotal !== next.totalBalance) {
				this.lastLoggedTotal = next.totalBalance;
				console.log(`[dsh-damage-pulse] 余额 ${next.currency} ${next.totalBalance.toFixed(2)} (赠送 ${next.grantedBalance.toFixed(2)} / 充值 ${next.toppedUpBalance.toFixed(2)})`);
			}
			return next;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			console.warn(`[dsh-damage-pulse] 余额查询失败: ${message}`);
			return;
		}
	}
	get() {
		return this.latest;
	}
	/** 启动轮询：立即查一次，之后每 pollMs 一次。 */
	start() {
		this.refresh();
		this.timer = setInterval(() => void this.refresh(), this.pollMs);
	}
	stop() {
		if (this.timer !== void 0) {
			clearInterval(this.timer);
			this.timer = void 0;
		}
	}
};
/** 挂载余额服务：启动轮询，fiber dispose 时清理定时器。 */
function attachBalance(ctx) {
	const service = new BalanceService(ctx);
	ctx.effect(() => {
		service.start();
		return () => service.stop();
	}, "dsh-damage-pulse balance polling");
	return service;
}
/** 注册余额 HTTP 端点（仅 web 装配有 webServer 服务）：Client 余额卡片定时拉取。 */
function registerBalanceRoute(ctx, service) {
	ctx.webServer.register({
		kind: "exact",
		path: "/api/token-monitor/balance",
		handler: (_req, res) => {
			const balance = service.get();
			res.writeHead(200, {
				"Content-Type": "application/json",
				"Cache-Control": "no-store"
			});
			res.end(JSON.stringify(balance ?? null));
		}
	});
}
//#endregion
//#region plugins/dsh-token-monitor/src/projection.ts
/**
* tokenCost projection：fold assistant/message.usage，累计每个会话的 token 用量与金额。
* 经 session-projection 缝自动推送（registry 快照 / 变更流 / session/projection 帧），
* Web Client 据此渲染「会话累计」统计条。
* @module dsh-token-monitor/projection
*/
const schema = z$1.object({
	calls: z$1.number().int().nonnegative(),
	inputTokens: z$1.number().int().nonnegative(),
	cacheReadTokens: z$1.number().int().nonnegative(),
	cacheWriteTokens: z$1.number().int().nonnegative(),
	outputTokens: z$1.number().int().nonnegative(),
	totalTokens: z$1.number().int().nonnegative(),
	cost: z$1.number().nonnegative(),
	lastActivity: z$1.number().nonnegative()
}).strict();
/** 按给定价格表构造 tokenCost projection 单元。 */
function createTokenCostProjectionDefinition(priceTable) {
	return {
		key: "tokenCost",
		schema,
		init: () => ({
			calls: 0,
			inputTokens: 0,
			cacheReadTokens: 0,
			cacheWriteTokens: 0,
			outputTokens: 0,
			cost: 0,
			lastActivity: 0
		}),
		apply: (state, event) => {
			if (event.type !== "assistant/message") return state;
			const usage = event.data.usage;
			if (usage === void 0) return state;
			const source = event.data.message.source;
			if (source.kind !== "model") return state;
			const inputTokens = usage.inputTokens;
			const cacheReadTokens = usage.cacheReadTokens ?? 0;
			const cacheWriteTokens = usage.cacheWriteTokens ?? 0;
			const outputTokens = usage.outputTokens;
			const breakdown = priceUsage(inputTokens, cacheReadTokens, cacheWriteTokens, outputTokens, source.model, event.time, priceTable);
			return {
				...state,
				calls: state.calls + 1,
				inputTokens: state.inputTokens + inputTokens,
				cacheReadTokens: state.cacheReadTokens + cacheReadTokens,
				cacheWriteTokens: state.cacheWriteTokens + cacheWriteTokens,
				outputTokens: state.outputTokens + outputTokens,
				cost: state.cost + breakdown.cost,
				lastActivity: event.time
			};
		},
		view: (state) => ({
			calls: state.calls,
			inputTokens: state.inputTokens,
			cacheReadTokens: state.cacheReadTokens,
			cacheWriteTokens: state.cacheWriteTokens,
			outputTokens: state.outputTokens,
			totalTokens: state.inputTokens + state.cacheReadTokens + state.cacheWriteTokens + state.outputTokens,
			cost: state.cost,
			lastActivity: state.lastActivity
		}),
		stateVersion: 2
	};
}
//#endregion
//#region plugins/dsh-token-monitor/src/storage.ts
/**
* 会话累计存储 + 单次用量明细持久化（JSONL）。
* 会话累计（tokenCost projection）已由 session-projection-cache 持久化；
* 这里额外落盘单次用量明细，供历史查询与导出。
* @module dsh-token-monitor/storage
*/
/** 明细数据目录：~/.dsh/data/dsh-token-monitor/ */
const DATA_DIR = join(homedir(), ".dsh", "data", "dsh-token-monitor");
/** 按会话累计用量与金额，并追加持久化单次明细。 */
var UsageStorage = class {
	summaries = /* @__PURE__ */ new Map();
	records = [];
	constructor() {
		try {
			mkdirSync(DATA_DIR, { recursive: true });
		} catch (error) {
			console.warn(`[dsh-damage-pulse] 创建数据目录失败: ${String(error)}`);
		}
		this.loadHistory();
	}
	/** 冷启动回读历史明细（fail-soft：文件缺失/损坏行静默跳过）。 */
	loadHistory() {
		try {
			const text = readFileSync(join(DATA_DIR, "usage.jsonl"), "utf8");
			for (const line of text.split("\n")) {
				const trimmed = line.trim();
				if (trimmed === "") continue;
				try {
					this.records.push(JSON.parse(trimmed));
				} catch {}
			}
			if (this.records.length > 0) console.log(`[dsh-damage-pulse] 已加载 ${this.records.length} 条历史明细`);
		} catch {}
	}
	/** 把一条单次记录累加到对应会话，并追加持久化明细。 */
	add(record) {
		const prev = this.summaries.get(record.sessionId);
		const next = prev === void 0 ? {
			sessionId: record.sessionId,
			calls: 1,
			inputTokens: record.inputTokens,
			cacheReadTokens: record.cacheReadTokens,
			cacheWriteTokens: record.cacheWriteTokens,
			outputTokens: record.outputTokens,
			totalTokens: record.inputTokens + record.cacheReadTokens + record.cacheWriteTokens + record.outputTokens,
			cost: record.cost,
			lastActivity: record.timestamp
		} : {
			...prev,
			calls: prev.calls + 1,
			inputTokens: prev.inputTokens + record.inputTokens,
			cacheReadTokens: prev.cacheReadTokens + record.cacheReadTokens,
			cacheWriteTokens: prev.cacheWriteTokens + record.cacheWriteTokens,
			outputTokens: prev.outputTokens + record.outputTokens,
			totalTokens: prev.totalTokens + record.inputTokens + record.cacheReadTokens + record.cacheWriteTokens + record.outputTokens,
			cost: prev.cost + record.cost,
			lastActivity: record.timestamp
		};
		this.summaries.set(record.sessionId, next);
		this.records.push(record);
		try {
			appendFileSync(join(DATA_DIR, "usage.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
		} catch (error) {
			console.warn(`[dsh-damage-pulse] 明细落盘失败: ${String(error)}`);
		}
		return next;
	}
	get(sessionId) {
		return this.summaries.get(sessionId);
	}
	list() {
		return [...this.summaries.values()];
	}
	/** 单次用量明细（可按会话过滤）。 */
	history(sessionId) {
		if (sessionId === void 0) return [...this.records];
		return this.records.filter((record) => record.sessionId === sessionId);
	}
};
//#endregion
//#region plugins/dsh-token-monitor/src/index.ts
const name = "dsh-token-monitor";
const inject = ["sessions", "credentials"];
const SETTINGS_NS = settingsNamespace("dsh-token-monitor");
/** 用户可编辑设置：价格表可覆盖（宽松 any，默认 PRICE_TABLE）。 */
const settingsSchema = z.object({ priceTable: z.any().default(PRICE_TABLE) });
/**
* 为缺失 tokenCost 投影的历史会话触发冷读重新 fold（一次性补齐，异步不阻塞启动）。
* 冷读会自动写回 checkpoint，之后列表读即可看到金额。
*/
async function migrateMissingTokenCost(ctx) {
	try {
		const headers = await ctx.sessionPersistence.list();
		let migrated = 0;
		for (const header of headers) {
			if (ctx.sessionProjectionCache.cachedSnapshot(header)?.values.tokenCost !== void 0) continue;
			await ctx.sessionProjectionCache.coldSnapshot(header.id);
			migrated++;
		}
		if (migrated > 0) console.log(`[dsh-damage-pulse] 已为 ${migrated} 个历史会话重建 tokenCost 投影`);
	} catch (error) {
		console.warn(`[dsh-damage-pulse] 历史会话投影迁移失败: ${String(error)}`);
	}
}
function apply(ctx) {
	console.log("[dsh-damage-pulse] plugin loaded");
	let priceTable = PRICE_TABLE;
	ctx.inject(["settings"], (settingsCtx) => {
		const section = settingsCtx.settings.register(SETTINGS_NS, settingsSchema).get();
		if (section?.priceTable !== void 0) {
			priceTable = section.priceTable;
			console.log(`[dsh-damage-pulse] 使用 settings 价格表 v${priceTable.version}`);
		}
	});
	const storage = new UsageStorage();
	attachCollector(ctx, storage, priceTable);
	const balance = attachBalance(ctx);
	ctx.inject(["sessionProjections"], (projectionCtx) => {
		projectionCtx.sessionProjections.register(createTokenCostProjectionDefinition(priceTable));
		console.log("[dsh-damage-pulse] tokenCost projection registered");
	});
	ctx.inject([
		"sessionProjections",
		"sessionProjectionCache",
		"sessionPersistence"
	], async (migrateCtx) => {
		await migrateMissingTokenCost(migrateCtx);
	});
	ctx.inject(["webServer"], (webCtx) => {
		registerBalanceRoute(webCtx, balance);
		console.log("[dsh-damage-pulse] balance route registered");
		webCtx.webServer.register({
			kind: "exact",
			path: "/api/token-monitor/usage",
			handler: (req, res) => {
				const sessionId = new URL(req.url ?? "/", "http://localhost").searchParams.get("sessionId") ?? void 0;
				const records = storage.history(sessionId);
				res.writeHead(200, {
					"Content-Type": "application/json",
					"Cache-Control": "no-store"
				});
				res.end(JSON.stringify(records));
			}
		});
		console.log("[dsh-damage-pulse] usage route registered");
		webCtx.webServer.register({
			kind: "exact",
			path: "/api/token-monitor/charge-events",
			handler: (req, res) => {
				const url = new URL(req.url ?? "/", "http://localhost");
				const events = chargesSince(Number(url.searchParams.get("since") ?? 0));
				res.writeHead(200, {
					"Content-Type": "application/json",
					"Cache-Control": "no-store"
				});
				res.end(JSON.stringify({
					seq: currentChargeSeq(),
					events
				}));
			}
		});
		console.log("[dsh-damage-pulse] charge-events route registered");
	});
}
//#endregion
export { apply, inject, name };
