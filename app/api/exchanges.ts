// получение бирж
export const getList = async (): Promise<ExchangesResponse> => useNuxtApp().$api("/api/exchanges/");

// получение пар монет
export const getMarkets = async (exchangesName: string, options = {}): Promise<ExchangesMarketsResponse> =>
	useNuxtApp().$api(`/api/exchanges/${exchangesName}/markets`, options);
