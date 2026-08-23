import keys from "@/api/keys";
import { useQueryClient } from "@tanstack/vue-query";
import { getList } from "@/api/orders";

export const useOrders = () => {
	const queryClient = useQueryClient();

	const searchOrders = async (exchangeName: string, query = {}): Promise<TOrderResponse> => {
		return queryClient.fetchQuery({
			queryKey: keys.getOrders(exchangeName, query),
			queryFn: () => getList(exchangeName, { query }),
		});
	};

	return { searchOrders };
};
