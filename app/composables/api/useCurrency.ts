import { useQuery } from "@tanstack/vue-query";
import keys from "@/api/keys";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export const useCurrency = () => {
	const { api } = useLocalApi();

	const currencyStore = useCurrencyStore();

	const query = useQuery<CurrencyResponse>({
		queryKey: keys.getCurrency,
		queryFn: () => api("/currency"),
	});

	const suspense = async () => {
		await query.suspense();
		currencyStore.rates = query.data.value?.rates ?? {};
	};

	return { ...query, suspense };
};
