// получение конфигов
export const getList = async (): Promise<TConfigsResponse> => useNuxtApp().$api("/api/configs/me");

// получение конфига по id
export const getOne = async (id: string): Promise<TConfigByIdResponse> => useNuxtApp().$api(`/api/configs/me/${id}`);
