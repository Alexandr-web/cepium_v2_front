import keys from "@/api/keys";
import Exchange from "@/models/Exchange";
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
				exchangeStore.exchangesMap = new Map(data.data.map((i) => [i.id, new Exchange(i)]));
			}
		},
		{ immediate: true }
	);

	return query;
};

export const useMarketsSearch = () => {
	const queryClient = useQueryClient();

	const searchMarkets = async (exchangeName: string, search: string): Promise<ExchangesMarketsResponse> => {
		return queryClient.fetchQuery({
			queryKey: keys.getExchangesMarkets(exchangeName, search),
			queryFn: () => getMarkets(exchangeName, { query: { search } }),
		});
	};

	return { searchMarkets };
};
