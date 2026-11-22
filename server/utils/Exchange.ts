import WebSocket from "ws";

export type ExchangePeer = {
	send: (data: string) => void;
};

/**
 * Базовый класс биржи: одно общее WebSocket-соединение и раздача тикеров и свечей подписчикам.
 * Соединение поднимается при первой подписке, закрывается при уходе последнего подписчика,
 * при обрыве переподключается с экспоненциальной задержкой и восстанавливает подписки.
 *
 * В наследнике нужно реализовать `topic`, `buildSubscribeMessage` и `parseMessage`.
 *
 * @typeParam TTicker - Тип тикера биржи.
 * @typeParam TMessage - Тип входящих сообщений биржи.
 * @typeParam TKline - Тип свечи биржи.
 *
 * @example
 * class Binance extends Exchange<BinanceTicker, BinanceMessage, BinanceKline> {
 *   constructor(options?: Partial<ExchangeOptions>) {
 *     super({ url: "wss://fstream.binance.com/ws", ...options });
 *   }
 *   protected topic(symbol, interval) { ... }
 *   protected buildSubscribeMessage(op, topic) { ... }
 *   protected parseMessage(msg) { ... }
 * }
 */
export abstract class Exchange<TTicker, TMessage = unknown, TKline = never> {
	protected readonly options: Required<ExchangeOptions>;

	private ws: WebSocket | null = null;
	private pingTimer: ReturnType<typeof setInterval> | null = null;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

	// Число неудачных попыток подряд, нужно для экспоненциальной задержки.
	private attempts = 0;
	// Подписчики по топику.
	private readonly peers = new Map<string, Set<ExchangePeer>>();
	// Последнее сообщение по топику: объединённый тикер или последняя свеча.
	private readonly cache = new Map<string, TickerServerMessage<TTicker, TKline>>();

	constructor(options: ExchangeOptions) {
		this.options = {
			url: options.url,
			ping: options.ping,
			pingInterval: options.pingInterval ?? 20_000,
			reconnectBaseDelay: options.reconnectBaseDelay ?? 1_000,
			maxReconnectDelay: options.maxReconnectDelay ?? 30_000,
			symbolPattern: options.symbolPattern ?? /^[A-Z0-9]{3,20}$/,
			intervals: options.intervals ?? [],
		};
	}

	// Топик подписки: тикер символа или, если указан `interval`, свечи. Он же ключ в `cache`.
	protected abstract topic(symbol: string, interval?: string): string;
	// Сообщение подписки или отписки в формате биржи.
	protected abstract buildSubscribeMessage(op: "subscribe" | "unsubscribe", topic: string): unknown;
	// Разбор входящего сообщения. Для служебных сообщений (pong, ответ на подписку) вернуть `null`.
	protected abstract parseMessage(msg: TMessage): TickerUpdate<TTicker, TKline> | null;

	/**
	 * Подписывает клиента на тикер символа или, если указан `interval`, на его свечи.
	 * Подписка на бирже создаётся один раз и делится между клиентами.
	 * Если есть кэш, клиент получает его сразу.
	 *
	 * @param rawSymbol - символ в любом регистре, например `btcusdt`.
	 * @param rawInterval - таймфрейм свечей, например `15`.
	 */
	subscribe(peer: ExchangePeer, rawSymbol: string, rawInterval?: string): void {
		const symbol = this.normalize(rawSymbol);
		if (!symbol) {
			return this.send([peer], { type: "error", message: "Invalid symbol" });
		}

		const interval = rawInterval ? this.normalizeInterval(rawInterval) : undefined;
		if (rawInterval && !interval) {
			return this.send([peer], { type: "error", message: "Invalid interval" });
		}

		const key = this.topic(symbol, interval);

		let set = this.peers.get(key);
		if (!set) {
			set = new Set();
			this.peers.set(key, set);
			this.sendOp("subscribe", key);
		}
		set.add(peer);

		const cached = this.cache.get(key);
		if (cached) this.send([peer], cached);

		if (!this.ws && !this.reconnectTimer) this.connect();
	}

	// Отписывает клиента. Без подписчиков на топик отписывается и от биржи, без подписчиков вообще закрывает соединение.
	unsubscribe(peer: ExchangePeer, rawSymbol: string, rawInterval?: string): void {
		const interval = rawInterval ? this.normalizeInterval(rawInterval) : undefined;
		if (rawInterval && !interval) return;

		this.release(peer, this.topic(this.normalize(rawSymbol), interval));
	}

	// Удаляет клиента из всех подписок. Вызывать при закрытии или ошибке соединения клиента.
	removePeer(peer: ExchangePeer): void {
		this.peers.keys().forEach((key) => this.release(peer, key));
	}

	private release(peer: ExchangePeer, key: string): void {
		const set = this.peers.get(key);
		if (!set) return;

		set.delete(peer);
		if (set.size) return;

		this.peers.delete(key);
		this.cache.delete(key);
		this.sendOp("unsubscribe", key);

		if (this.peers.size) return;

		if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
		this.reconnectTimer = null;

		// Сбрасываем состояние сразу, чтобы новая подписка открыла свежее соединение, не дожидаясь close
		const ws = this.ws;
		this.cleanup();
		ws?.close();
	}

	// Приводит символ к верхнему регистру и проверяет по `symbolPattern`. Для невалидного вернёт `""`.
	protected normalize(symbol: string): string {
		const s = String(symbol ?? "").trim().toUpperCase();
		return this.options.symbolPattern.test(s) ? s : "";
	}

	// Приводит таймфрейм к верхнему регистру и проверяет по `intervals`. Для невалидного вернёт `""`.
	protected normalizeInterval(interval: string): string {
		const i = String(interval).trim().toUpperCase();
		return this.options.intervals.includes(i) ? i : "";
	}

	// Сериализует сообщение один раз и отправляет всем указанным клиентам.
	private send(peers: Iterable<ExchangePeer>, msg: TickerServerMessage<TTicker, TKline>): void {
		const payload = JSON.stringify(msg);
		Array.from(peers).forEach((peer) => peer.send(payload));
	}

	// Если соединение ещё не открыто, подписки отправятся в `open`.
	private sendOp(op: "subscribe" | "unsubscribe", key: string): void {
		if (this.ws?.readyState !== WebSocket.OPEN) return;
		this.ws.send(JSON.stringify(this.buildSubscribeMessage(op, key)));
	}

	private cleanup(): void {
		if (this.pingTimer) clearInterval(this.pingTimer);
		this.pingTimer = null;
		this.ws = null;
	}

	private connect(): void {
		const socket = new WebSocket(this.options.url);
		this.ws = socket;

		socket.on("open", () => {
			this.attempts = 0;

			// При реконнекте биржа подписки не помнит
			this.peers.keys().forEach((key) => this.sendOp("subscribe", key));

			const { ping, pingInterval } = this.options;
			if (ping !== undefined && pingInterval > 0) {
				this.pingTimer = setInterval(() => {
					if (socket.readyState === WebSocket.OPEN) {
						socket.send(JSON.stringify(ping));
					}
				}, pingInterval);
			}
		});

		socket.on("message", (rawData) => {
			try {
				const update = this.parseMessage(JSON.parse(rawData.toString()));
				if (!update) return;

				const { symbol } = update;
				const key = this.topic(symbol, update.interval);
				const peers = this.peers.get(key);
				if (!peers) return;

				// Тикер приходит дельтами и объединяется, свеча приходит целиком
				const prev = this.cache.get(key);
				const msg: TickerServerMessage<TTicker, TKline> = update.interval === undefined
					? {
						type: "ticker",
						data: { ...(prev?.type === "ticker" ? prev.data : undefined), ...update.data, symbol },
					}
					: { type: "kline", interval: update.interval, data: update.data };

				this.cache.set(key, msg);
				this.send(peers, msg);
			} catch (err) {
				console.error(err);
			}
		});

		socket.onerror = (err) => console.error(err);

		socket.on("close", () => {
			// Закрылся устаревший сокет, актуальное соединение уже другое
			if (this.ws !== socket) return;

			this.cleanup();
			if (!this.peers.size) return;

			const { reconnectBaseDelay, maxReconnectDelay } = this.options;
			const delay = Math.min(reconnectBaseDelay * 2 ** this.attempts++, maxReconnectDelay);

			this.reconnectTimer = setTimeout(() => {
				this.reconnectTimer = null;
				this.connect();
			}, delay);
		});
	}
};
