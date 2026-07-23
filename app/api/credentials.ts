// получение данных биржи
export const getData = async (options = {}): Promise<TExchangeCredentialsResponse> => useNuxtApp().$api("/api/credentials", options);

// создание данных биржи
export const createData = async (body: TExchangeCredentials, exchangeName: string): Promise<TCreateExchangeCredentialsResponse> => 
	useNuxtApp().$api(`/api/credentials/${exchangeName}`, {
		method: "POST",
		body,
	});

// изменение данных биржи
export const changeData = async (body: TExchangeCredentials, exchangeName: string): Promise<TChangeExchangeCredentialsResponse> => 
	useNuxtApp().$api(`/api/credentials/${exchangeName}`, {
		method: "PATCH",
		body,
	});
