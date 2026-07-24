// получение конфигов
export const getList = async (): Promise<TConfigsResponse> => useNuxtApp().$api("/api/configs/me");
