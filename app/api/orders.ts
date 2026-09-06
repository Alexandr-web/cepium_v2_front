// получение ордеров
export const getList = async (exchangeName: string, options = {}): Promise<OrderResponse> =>
	useNuxtApp().$api(`/api/orders/${exchangeName}`, options);

// удаление ордера
export const removeOne = (exchangeName: string, id: string): Promise<RemoveOrderResponse> => 
	useNuxtApp().$api(`/api/orders/${exchangeName}/${id}`, { method: "DELETE" });
