// получение бирж
export const getList = async (): Promise<TExchangesResponse> => useNuxtApp().$api("/api/exchanges/");
