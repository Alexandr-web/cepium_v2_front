import keys from "@/api/keys";
import type { FetchError } from "ofetch";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

export const useOrders = () => {
	const { api } = useApi();
	const queryClient = useQueryClient();

	const searchOrders = async (query = {}): Promise<OrderResponse> => {
		return queryClient.fetchQuery<OrderResponse>({
			queryKey: keys.getOrders(query),
			queryFn: () => api("/api/orders", { query }),
		});
	};

	return { searchOrders };
};

export const useRemoveOne = (onSuccess?: (id: string) => void) => {
	const { api } = useApi();
	const errMessage = ref("");

	const { mutateAsync, isPending } = useMutation<
		RemoveOrderResponse,
		FetchError,
		string
	>({
		mutationFn: (id) => api(`/api/orders/${id}`, { method: "DELETE" }),
		onSuccess: (data) => {
			const pnl = formatNum(Number(data.data.realizedPnl), { currency: "USD", style: "currency" });
			push.success(`Позиция ${data.data.side?.toUpperCase()} ${data.data.symbol} закрыта. Профит ${pnl}`);

			onSuccess?.(String(data.data.id));
		},
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
			push.error(errMessage.value);
		},
	});

	return { mutateAsync, isPending, errMessage };
};
