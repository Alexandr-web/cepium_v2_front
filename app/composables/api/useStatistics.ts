import keys from "@/api/keys";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getSummary, getCharts } from "@/api/statistics";

export const useSummary = () => {
	return useQuery({
		queryKey: keys.getStatistics,
		queryFn: getSummary,
	});
};

export const useCharts = () => {
	const queryClient = useQueryClient();

	const searchData = async (query = {}): Promise<StatisticsChartsResponse> => {
		return queryClient.fetchQuery({
			queryKey: keys.getStatisticsCharts(query),
			queryFn: () => getCharts({ query }),
		});
	};

	return { searchData };
};
