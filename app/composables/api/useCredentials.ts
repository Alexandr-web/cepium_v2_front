import keys from "@/api/keys";
import { useQuery } from "@tanstack/vue-query";
import { getData } from "@/api/credentials";

export const useCredentials = (options = {}) => {
	return useQuery({
		queryKey: keys.getCredentials,
		queryFn: () => getData(options),
	});
};
