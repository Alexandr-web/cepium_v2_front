import keys from "@/api/keys";
import { useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

export const useCoinGeckoSearch = () => {
	const config = useRuntimeConfig();
	const { api } = useApi(config.public.geckoApiUrl);
	const queryClient = useQueryClient();

	const findCoinId = async (symbolPair: string): Promise<string | null> => {
		const baseSymbol = extractBaseSymbol(symbolPair);
		if (!baseSymbol) return null;

		const data = await queryClient.fetchQuery<GeckoSearchResponse>({
			queryKey: keys.getCoinGeckoId(baseSymbol),
			queryFn: () => api("/search", { query: { query: baseSymbol } }),
			staleTime: 1000 * 60 * 60 * 24,
		});

		const coinsMap = new Map(data.coins.map((coin) => [coin.symbol.toUpperCase(), coin.id]));

		return coinsMap.get(baseSymbol) ?? null;
	};

	return { findCoinId };
};
