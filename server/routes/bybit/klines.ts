/**
 * Nitro route: прокси запроса к Bybit REST API для исторических свечей.
 *
 * Эндпоинт: GET /bybit/klines
 * Параметры query:
 *   - symbol: символ в формате Bybit (BTCUSDT, ETHUSDT ...)
 *   - interval: таймфрейм (1, 3, 5, 15, 30, 60, 120, 240, 360, 720, D, W, M)
 *   - limit: кол-во свечей (1-200, по умолчанию 200)
 *   - start: время начала в мс (опционально)
 *   - end: время окончания в мс (опционально)
 *
 * Bybit v5 REST API:
 *   GET /v5/market/kline?category=linear&symbol={symbol}&interval={interval}&limit={limit}&start={start}&end={end}
 */
export default defineEventHandler(async (event) => {
	const { symbol, interval, limit = "200", start, end } = getQuery(event);

	if (!symbol || typeof symbol !== "string") {
		throw createError({ statusCode: 400, statusMessage: "Отсутствует обязательный параметр: symbol" });
	}

	if (!interval || typeof interval !== "string") {
		throw createError({ statusCode: 400, statusMessage: "Отсутствует обязательный параметр: interval" });
	}

	const normalizedInterval = String(interval).trim().toUpperCase();

	if (!BYBIT_INTERVALS.includes(normalizedInterval)) {
		throw createError({
			statusCode: 400,
			statusMessage: `Недопустимый интервал: ${interval}. Доступные: ${BYBIT_INTERVALS.join(", ")}`,
		});
	}

	const normalizedLimit = Math.min(200, Math.max(1, Number(limit)));
	const normalizedSymbol = String(symbol).trim().toUpperCase();

	const params = new URLSearchParams({
		category: "linear",
		symbol: normalizedSymbol,
		interval: normalizedInterval,
		limit: String(normalizedLimit),
	});

	if (start) params.set("start", String(start));
	if (end) params.set("end", String(end));

	const response = await $fetch(
		`https://api.bybit.com/v5/market/kline?${params.toString()}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);

	return response;
});
