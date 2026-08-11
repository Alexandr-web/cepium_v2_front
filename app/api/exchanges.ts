// получение бирж
export const getList = async (): Promise<TExchangesResponse> => useNuxtApp().$api("/api/exchanges/");

// получение пар монет
export const getMarkets = async (exchangesName: string, options = {}): Promise<TExchangesMarketsResponse> =>
	useNuxtApp().$api(`/api/exchanges/${exchangesName}/markets`, options);
