import keys from "@/api/keys";
import type { FetchError } from "ofetch";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getList, removeOne } from "@/api/orders";

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

export const useRemoveOne = (_exchangeName: MaybeRefOrGetter<string>, onSuccess?: (id: string) => void) => {
	const exchangeName = computed(() => toValue(_exchangeName));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TRemoveOrderResponse,
		FetchError,
		string
	>({
		mutationFn: (id) => removeOne(exchangeName.value, id),
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

	return { mutate, isPending, errMessage };
};
