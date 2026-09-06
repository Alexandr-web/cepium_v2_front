// получение стратегий
export const getData = async (): Promise<StrategyDataResponse> => useNuxtApp().$api("/api/strategies");
