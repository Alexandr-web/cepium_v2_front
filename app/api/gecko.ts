// получение данных по символу монеты с сервиса CoinGecko
export const searchCoin = async (query: string): Promise<TGeckoSearchResponse> =>
	useNuxtApp().$api("/api/gecko/search", { query: { query } });
