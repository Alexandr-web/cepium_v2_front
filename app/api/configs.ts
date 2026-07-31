// получение конфигов
export const getList = async (): Promise<TConfigsResponse> => useNuxtApp().$api("/api/configs/me");

// получение конфига по id
export const getOne = async (id: string): Promise<TConfigByIdResponse> => useNuxtApp().$api(`/api/configs/me/${id}`);

// добавление конфига
export const createOne = async (exchangeName: string, body: TConfigData): Promise<TConfigCreateResponse> =>
	useNuxtApp().$api(`/api/configs/me/exchanges/${exchangeName}`, {
		method: "POST",
		body,
	});

// изменение конфига
export const changeOne = async (id: string, body: TConfigData): Promise<TConfigChangeResponse> =>
	useNuxtApp().$api(`/api/configs/me/${id}`, {
		method: "PATCH",
		body,
	});
