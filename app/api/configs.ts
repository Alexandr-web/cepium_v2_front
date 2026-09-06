// получение конфигов
export const getList = async (): Promise<ConfigsResponse> => useNuxtApp().$api("/api/configs/me");

// получение конфига по id
export const getOne = async (id: string): Promise<ConfigByIdResponse> => useNuxtApp().$api(`/api/configs/me/${id}`);

// добавление конфига
export const createOne = async (exchangeName: string, body: ConfigData): Promise<ConfigCreateResponse> =>
	useNuxtApp().$api(`/api/configs/me/exchanges/${exchangeName}`, {
		method: "POST",
		body,
	});

// изменение конфига
export const changeOne = async (id: string, body: ConfigData): Promise<ConfigChangeResponse> =>
	useNuxtApp().$api(`/api/configs/me/${id}`, {
		method: "PATCH",
		body,
	});
