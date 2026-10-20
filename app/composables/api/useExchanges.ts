import keys from "@/api/keys";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

export const useExchanges = () => {
	const { api } = useApi();

	const query = useQuery<ExchangesResponse>({
		queryKey: keys.getExchanges,
		queryFn: () => api("/api/exchanges/"),
	});

	return query;
};

export const useMarketsSearch = () => {
	const { api } = useApi();
	const queryClient = useQueryClient();

	const searchMarkets = async (exchangeName: string, search: string): Promise<ExchangesMarketsResponse> => {
		return queryClient.fetchQuery<ExchangesMarketsResponse>({
			queryKey: keys.getExchangesMarkets(exchangeName, search),
			queryFn: () => api(`/api/exchanges/${exchangeName}/markets`, { query: { search } }),
		});
	};

	return { searchMarkets };
};
