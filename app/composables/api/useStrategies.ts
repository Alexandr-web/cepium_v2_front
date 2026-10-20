import keys from "@/api/keys";
import { useQuery } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

export const useStrategy = () => {
	const { api } = useApi();

	return useQuery<StrategyDataResponse>({
		queryKey: keys.getStrategy,
		queryFn: () => api("/api/strategies"),
	});
};
