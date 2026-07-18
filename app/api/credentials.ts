// получение данных биржи
export const getData = async (options = {}): Promise<TExchangeCredentialsResponse> => useNuxtApp().$api("/api/credentials", options);
