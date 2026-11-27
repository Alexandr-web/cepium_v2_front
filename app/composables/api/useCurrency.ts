import { useQuery } from "@tanstack/vue-query";
import keys from "@/api/keys";
import { useCurrencyStore } from "@/store/useCurrencyStore";

export const useCurrency = () => {
	const config = useRuntimeConfig();
	const { api } = useApi(config.public.currencyApiUrl);

	const currencyStore = useCurrencyStore();

	const query = useQuery<CurrencyResponse>({
		queryKey: keys.getCurrency,
		queryFn: () => api("/latest/USD"),
	});

	const suspense = async () => {
		await query.suspense();
		if (query.data.value) {
			for (const key in query.data.value.rates) {
				if (Object.keys(currencyStore.rates).length >= ALLOWED_CURRENCIES.length) break;
				const val = Number(query.data.value.rates[key]);
				if (ALLOWED_CURRENCIES.includes(key)) currencyStore.rates[key] = val;
			}
		}
	};

	return { ...query, suspense };
};
