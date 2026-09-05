// получение ордеров
export const getList = async (exchangeName: string, options = {}): Promise<TOrderResponse> =>
	useNuxtApp().$api(`/api/orders/${exchangeName}`, options);

// удаление ордера
export const removeOne = (exchangeName: string, id: string): Promise<TRemoveOrderResponse> => 
	useNuxtApp().$api(`/api/orders/${exchangeName}/${id}`, { method: "DELETE" });
