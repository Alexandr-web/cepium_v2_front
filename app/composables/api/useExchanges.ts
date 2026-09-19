import keys from "@/api/keys";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getList, getMarkets } from "@/api/exchanges";

export const useExchanges = () => {
	const query = useQuery({
		queryKey: keys.getExchanges,
		queryFn: getList,
	});

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
