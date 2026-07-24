import keys from "@/api/keys";
import { useQuery } from "@tanstack/vue-query";
import { getData } from "@/api/strategy";

export const useStrategy = () => {
	return useQuery({
		queryKey: keys.getStrategy,
		queryFn: getData,
	});
};
