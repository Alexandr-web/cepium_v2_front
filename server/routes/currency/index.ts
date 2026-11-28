export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event);
	const { base = DEFAULT_CURRENCY } = getQuery(event);
	const response = await $fetch<CurrencyResponse>(`${config.public.currencyApiUrl}/latest/${base}`);

	const rates: Record<string, number> = {};

	if (response.rates) {
		for (const key in response.rates) {
			if (Object.keys(rates).length >= ALLOWED_CURRENCIES.length) break;
			const val = Number(response.rates[key]);
			if (ALLOWED_CURRENCIES.includes(key)) rates[key] = val;
		}
	}

	return { ...response, rates };
});
