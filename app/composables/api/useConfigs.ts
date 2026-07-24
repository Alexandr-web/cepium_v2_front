import keys from "@/api/keys";
import { useQuery } from "@tanstack/vue-query";
import { getList } from "@/api/configs";

export const useConfigs = () => {
	return useQuery({
		queryKey: keys.getConfigs,
		queryFn: getList,
	});
};
