import keys from "@/api/keys";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

export const useSummary = () => {
	const { api } = useApi();

	return useQuery<StatisticsResponse>({
		queryKey: keys.getStatistics,
		queryFn: () => api("/api/statistics/summary"),
	});
};

export const useCharts = () => {
	const { api } = useApi();
	const queryClient = useQueryClient();

	const searchData = async (options = {}): Promise<StatisticsChartsResponse> => {
		return queryClient.fetchQuery<StatisticsChartsResponse>({
			queryKey: keys.getStatisticsCharts(options),
			queryFn: () => api("/api/statistics/charts", options),
		});
	};

	return { searchData };
};
