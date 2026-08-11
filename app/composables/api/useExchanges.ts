import keys from "@/api/keys";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getList, getMarkets } from "@/api/exchanges";
import { useExchangeStore } from "@/store/useExchangeStore";

export const useExchanges = () => {
	const exchangeStore = useExchangeStore();

	const query = useQuery({
		queryKey: keys.getExchanges,
		queryFn: getList,
	});

	watch(
		() => query.data.value,
		(data) => {
			if (data?.data) {
				exchangeStore.exchanges = data.data;
			}
		},
		{ immediate: true }
	);

	return query;
};

export const useMarketsSearch = () => {
	const queryClient = useQueryClient();

	const searchMarkets = async (exchangeName: string, search: string): Promise<TExchangesMarketsResponse> => {
		return queryClient.fetchQuery({
			queryKey: keys.getExchangesMarkets(exchangeName, search),
			queryFn: () => getMarkets(exchangeName, { query: { search } }),
		});
	};

	return { searchMarkets };
};
