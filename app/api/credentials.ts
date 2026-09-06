// получение данных биржи
export const getData = async (options = {}): Promise<ExchangeCredentialsResponse> => useNuxtApp().$api("/api/credentials", options);

// создание данных биржи
export const createData = async (body: ExchangeCredentials, exchangeName: string): Promise<CreateExchangeCredentialsResponse> => 
	useNuxtApp().$api(`/api/credentials/${exchangeName}`, {
		method: "POST",
		body,
	});

// изменение данных биржи
export const changeData = async (body: ExchangeCredentials, exchangeName: string): Promise<ChangeExchangeCredentialsResponse> => 
	useNuxtApp().$api(`/api/credentials/${exchangeName}`, {
		method: "PATCH",
		body,
	});
