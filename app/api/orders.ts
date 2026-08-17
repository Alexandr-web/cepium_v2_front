// получение ордеров
export const getList = async (exchangeName: string, options = {}): Promise<TOrderResponse> =>
	useNuxtApp().$api(`/api/orders/${exchangeName}`, options);
