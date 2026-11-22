export type BybitTicker = {
	symbol: string;
	lastPrice?: string;
	markPrice?: string;
	indexPrice?: string;
	prevPrice24h?: string;
	price24hPcnt?: string;
	highPrice24h?: string;
	lowPrice24h?: string;
	volume24h?: string;
	turnover24h?: string;
	bid1Price?: string;
	ask1Price?: string;
	fundingRate?: string;
	nextFundingTime?: string;
	[key: string]: string | undefined;
};

export type BybitKline = {
	symbol: string;
	// Время открытия свечи, мс.
	start: number;
	// Время закрытия свечи, мс.
	end: number;
	interval: string;
	open: string;
	close: string;
	high: string;
	low: string;
	volume: string;
	turnover: string;
	// true, когда свеча закрыта.
	confirm: boolean;
	// Время последнего обновления свечи, мс.
	timestamp: number;
};

export type BybitOpResponse = {
	op: "subscribe" | "unsubscribe" | "ping" | "pong";
	success?: boolean;
	ret_msg?: string;
	conn_id?: string;
	req_id?: string;
};

export type BybitTickerPush = {
	topic: `tickers.${string}`;
	type: "snapshot" | "delta";
	ts: number;
	cs?: number;
	data: BybitTicker;
};

export type BybitKlinePush = {
	topic: `kline.${string}.${string}`;
	type: "snapshot";
	ts: number;
	data: Omit<BybitKline, "symbol">[];
};

export type BybitMessage = BybitOpResponse | BybitTickerPush | BybitKlinePush;

// Сообщение, которое биржа отправляет клиентам.
export type TickerServerMessage<TTicker, TKline = never> =
	| { type: "ticker"; data: Partial<TTicker>; }
	| { type: "kline"; interval: string; data: TKline; }
	| { type: "error"; message: string; };

// Обновление от биржи: тикер (полный снимок или delta) либо свеча, если указан `interval`.
export type TickerUpdate<TTicker, TKline = never> =
	| { symbol: string; interval?: undefined; data: Partial<TTicker>; }
	| { symbol: string; interval: string; data: TKline; };

export type ExchangeOptions = {
	// URL WebSocket-эндпоинта биржи.
	url: string;
	// Сообщение ping. Без него ping не отправляется.
	ping?: unknown;
	// Интервал ping в миллисекундах. По умолчанию `20000`.
	pingInterval?: number;
	// Начальная задержка переподключения в миллисекундах (далее удваивается). По умолчанию `1000`.
	reconnectBaseDelay?: number;
	// Максимальная задержка переподключения в миллисекундах. По умолчанию `30000`.
	maxReconnectDelay?: number;
	// Проверка символа после приведения к верхнему регистру. По умолчанию `/^[A-Z0-9]{3,20}$/`.
	symbolPattern?: RegExp;
	// Допустимые таймфреймы для свечей. По умолчанию пусто.
	intervals?: readonly string[];
};
