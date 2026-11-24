/**
 * Реактивный композабл для парсинга и форматирования рыночных данных Bybit (тикера и текущей свечи).
 * Принимает как статические объекты, так и реактивные ссылки (`ref`, `computed`, геттеры).
 *
 * @param {MaybeRefOrGetter<TickerData | null>} _ticker - Данные 24-часового тикера Bybit (цена, изменение в %, хай/лоу, объем, оборот).
 * @param {MaybeRefOrGetter<BybitKline | null>} _kline - Данные свечи (kline) Bybit (цены открытия/максимума/минимума, объем, оборот).
 *
 * @returns {{
 *   lastPrice: ComputedRef<number>;
 *   price24hPcnt: ComputedRef<number>;
 *   highPrice24h: ComputedRef<number>;
 *   lowPrice24h: ComputedRef<number>;
 *   volume24h: ComputedRef<number>;
 *   turnover24h: ComputedRef<number>;
 *   klineOpen: ComputedRef<number>;
 *   klineHigh: ComputedRef<number>;
 *   klineLow: ComputedRef<number>;
 *   klineVolume: ComputedRef<number>;
 *   klineTurnover: ComputedRef<number>;
 *   formatLastPrice: ComputedRef<string>;
 *   formatPrice24hPcnt: ComputedRef<string>;
 *   formatHighPrice24h: ComputedRef<string>;
 *   formatLowPrice24h: ComputedRef<string>;
 *   formatVolume24h: ComputedRef<string>;
 *   formatTurnover24h: ComputedRef<string>;
 *   formatKlineOpen: ComputedRef<string>;
 *   formatKlineHigh: ComputedRef<string>;
 *   formatKlineLow: ComputedRef<string>;
 *   formatKlineVolume: ComputedRef<string>;
 *   formatKlineTurnover: ComputedRef<string>;
 * }} Объект с сырыми числовыми (`ComputedRef<number>`) и отформатированными строковыми (`ComputedRef<string>`) показателями.
 *
 * @example
 * const { formatLastPrice, formatPrice24hPcnt } = useBybitSymbol(() => props.ticker, currentKline);
 */
export const useBybitSymbol = (_ticker: MaybeRefOrGetter<TickerData | null>, _kline: MaybeRefOrGetter<BybitKline | null>) => {
	const ticker = computed(() => toValue(_ticker));
	const kline = computed(() => toValue(_kline));

	// сырые данные ticker
	const lastPrice = computed(() => parseFloat(String(ticker.value?.lastPrice)));
	const price24hPcnt = computed(() => parseFloat(String(ticker.value?.price24hPcnt)));
	const highPrice24h = computed(() => parseFloat(String(ticker.value?.highPrice24h)));
	const lowPrice24h = computed(() => parseFloat(String(ticker.value?.lowPrice24h)));
	const volume24h = computed(() => parseFloat(String(ticker.value?.volume24h)));
	const turnover24h = computed(() => parseFloat(String(ticker.value?.turnover24h)));

	// сырые данные kline
	const klineOpen = computed(() => parseFloat(String(kline.value?.open)));
	const klineHigh = computed(() => parseFloat(String(kline.value?.high)));
	const klineLow = computed(() => parseFloat(String(kline.value?.low)));
	const klineVolume = computed(() => parseFloat(String(kline.value?.volume)));
	const klineTurnover = computed(() => parseFloat(String(kline.value?.turnover)));

	// форматированные данные ticker
	const formatLastPrice = computed(() => formatNum(lastPrice.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));
	const formatPrice24hPcnt = computed(() => formatNumberSign(price24hPcnt.value, formatNum(price24hPcnt.value, { padZero: true, style: "percent", defaultValue: "-" })));
	const formatHighPrice24h = computed(() => formatNum(highPrice24h.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));
	const formatLowPrice24h = computed(() => formatNum(lowPrice24h.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));
	const formatVolume24h = computed(() => formatNum(volume24h.value, { padZero: true, style: "decimal", defaultValue: "-" }));
	const formatTurnover24h = computed(() => formatNum(turnover24h.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));

	// форматированные данные ticker
	const formatKlineOpen = computed(() => formatNum(klineOpen.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));
	const formatKlineHigh = computed(() => formatNum(klineHigh.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));
	const formatKlineLow = computed(() => formatNum(klineLow.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));
	const formatKlineVolume = computed(() => formatNum(klineVolume.value, { padZero: true, style: "decimal", defaultValue: "-" }));
	const formatKlineTurnover = computed(() => formatNum(klineTurnover.value, { maximumFractionDigits: 4, currency: "USD", style: "currency", defaultValue: "-" }));

	return {
		lastPrice,
		price24hPcnt,
		highPrice24h,
		lowPrice24h,
		volume24h,
		turnover24h,
		klineOpen,
		klineHigh,
		klineLow,
		klineVolume,
		klineTurnover,
		formatLastPrice,
		formatPrice24hPcnt,
		formatHighPrice24h,
		formatLowPrice24h,
		formatVolume24h,
		formatTurnover24h,
		formatKlineOpen,
		formatKlineHigh,
		formatKlineLow,
		formatKlineVolume,
		formatKlineTurnover,
	};
};
