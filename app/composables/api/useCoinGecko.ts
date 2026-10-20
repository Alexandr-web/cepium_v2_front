import keys from "@/api/keys";
import { useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

export const useCoinGeckoSearch = () => {
	const { api } = useApi();
	const queryClient = useQueryClient();

	const findCoinId = async (symbolPair: string): Promise<string | null> => {
		const baseSymbol = extractBaseSymbol(symbolPair);
		if (!baseSymbol) return null;

		const data = await queryClient.fetchQuery<GeckoSearchResponse>({
			queryKey: keys.getCoinGeckoId(baseSymbol),
			queryFn: () => api("/api/gecko/search", { query: { query: baseSymbol } }),
			staleTime: 1000 * 60 * 60 * 24,
		});

		return data.coins.find((coin) => coin.symbol.toUpperCase() === baseSymbol)?.id ?? data.coins[0]?.id ?? null;
	};

	return { findCoinId };
};
