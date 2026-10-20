// получение ордеров
export const getList = async (options = {}): Promise<OrderResponse> =>
	useNuxtApp().$api("/api/orders", options);

// удаление ордера
export const removeOne = (id: string): Promise<RemoveOrderResponse> => 
	useNuxtApp().$api(`/api/orders/${id}`, { method: "DELETE" });
