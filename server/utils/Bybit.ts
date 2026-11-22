import { Exchange } from "./Exchange";

export const BYBIT_INTERVALS = ["1", "3", "5", "15", "30", "60", "120", "240", "360", "720", "D", "W", "M"];

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

	protected topic(symbol: string, interval?: string) {
		return interval ? `kline.${interval}.${symbol}` : `tickers.${symbol}`;
	}

	protected buildSubscribeMessage(op: "subscribe" | "unsubscribe", topic: string) {
		return { op, args: [topic] };
	}

	protected parseMessage(msg: BybitMessage) {
		if ("op" in msg && msg.op === "subscribe" && !msg.success) {
			console.error(msg);
			return null;
		}

		if (!("topic" in msg) || !("data" in msg)) return null;

		// kline.<interval>.<symbol>, у свечей data это массив
		if (Array.isArray(msg.data)) {
			const [, interval, symbol] = msg.topic.split(".");
			const candle = msg.data[0];
			if (!candle || !interval || !symbol) return null;

			return { symbol, interval, data: { ...candle, symbol } };
		}

		if (!msg.topic.startsWith("tickers.")) return null;

		const symbol = msg.data.symbol ?? msg.topic.slice("tickers.".length);
		return { symbol, data: msg.data };
	}
};
