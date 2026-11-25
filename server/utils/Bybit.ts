import { Exchange } from "./Exchange";

/**
 * Bybit (USDT-перпетуалы, топики `tickers.<symbol>` и `kline.<interval>.<symbol>`).
 *
 * @example
 * const testnet = new Bybit({ url: "wss://stream-testnet.bybit.com/v5/public/linear" });
 */
export class Bybit extends Exchange<BybitTicker, BybitMessage, BybitKline> {
	constructor(options?: Partial<ExchangeOptions>) {
		super({
			url: "wss://stream.bybit.com/v5/public/linear",
			// Bybit закрывает соединение без активности
			ping: { op: "ping" },
			intervals: BYBIT_INTERVALS,
			...options,
		});
	}

	/**
	 * Формирует название топика Bybit для подписки на свечи или тикер.
	 *
	 * @param symbol Торговая пара (например, `"BTCUSDT"`).
	 * @param interval Таймфрейм свечи. Если не передан, возвращается топик тикера.
	 * @returns Строка топика в формате `kline.<interval>.<symbol>` или `tickers.<symbol>`.
	 */
	protected topic(symbol: string, interval?: string) {
		return interval ? `kline.${interval}.${symbol}` : `tickers.${symbol}`;
	}

	/**
	 * Формирует payload сообщения для подписки или отписки от топика.
	 *
	 * @param op Тип операции (`"subscribe"` или `"unsubscribe"`).
	 * @param topic Название топика.
	 * @returns Объект запроса в формате API Bybit.
	 */
	protected buildSubscribeMessage(op: "subscribe" | "unsubscribe", topic: string) {
		return { op, args: [topic] };
	}

	/**
	 * Разбирает входящее сообщение от WebSocket-сервера Bybit.
	 * Логирует ошибки подписки и игнорирует сервисные сообщения (например, `pong`).
	 *
	 * @param msg Сырое входящее сообщение от биржи.
	 * @returns Нормализованный объект с данными тикера или свечи, либо `null`, если сообщение не содержит рыночных данных.
	 */
	protected parseMessage(msg: BybitMessage) {
		if ("op" in msg && msg.op === "subscribe" && !msg.success) {
			console.error(msg);
			return null;
		}

		if (!("topic" in msg) || !("data" in msg)) return null;

		// kline.<interval>.<symbol>, у свечей data это массив
		if (Array.isArray(msg.data)) {
			const [_, interval, symbol] = msg.topic.split(".");
			const candle = msg.data[0];
			if (!candle || !interval || !symbol) return null;

			return { symbol, interval, data: { ...candle, symbol } };
		}

		if (!msg.topic.startsWith("tickers.")) return null;

		const symbol = msg.data.symbol ?? msg.topic.slice("tickers.".length);
		return { symbol, data: msg.data };
	}
};
