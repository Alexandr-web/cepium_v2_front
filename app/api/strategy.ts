// получение стратегий
export const getData = async (): Promise<TStrategyDataResponse> => useNuxtApp().$api("/api/strategies");
