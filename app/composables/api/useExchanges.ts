import keys from "@/api/keys";
import { useQuery } from "@tanstack/vue-query";
import { getList } from "@/api/exchanges";
import { useExchangeStore } from "@/store/useExchangeStore";

export const useExchanges = () => {
	const exchangeStore = useExchangeStore();

	const query = useQuery({
		queryKey: keys.getExchanges,
		queryFn: getList,
	});

	const suspense = async () => {
		await query.suspense();
		if (query.data.value?.data) {
			exchangeStore.exchanges = query.data.value.data;
		}
	};

	return { ...query, suspense };
};
