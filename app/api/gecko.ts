// получение данных по символу монеты с сервиса CoinGecko
export const searchCoin = async (query: string): Promise<GeckoSearchResponse> =>
	useNuxtApp().$api("/api/gecko/search", { query: { query } });
