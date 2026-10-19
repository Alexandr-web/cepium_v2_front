import keys from "@/api/keys";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getData, getSignals } from "@/api/metrics";

export const useMetrics = () => {
	return useQuery({
		queryKey: keys.getMetrics,
		queryFn: getData,
	});
};

export const useSignals = () => {
	const queryClient = useQueryClient();

	const searchSignals = async (query = {}) => {
		return queryClient.fetchQuery({
			queryKey: keys.getMetricsSignals(query),
			queryFn: () => getSignals({ query }),
		});
	};

	return { searchSignals };
};
