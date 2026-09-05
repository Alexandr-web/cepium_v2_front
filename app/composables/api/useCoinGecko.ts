import keys from "@/api/keys";
import { searchCoin } from "@/api/gecko";
import { useQueryClient } from "@tanstack/vue-query";

export const useCoinGeckoSearch = () => {
	const queryClient = useQueryClient();

	const findCoinId = async (symbolPair: string): Promise<string | null> => {
		const baseSymbol = extractBaseSymbol(symbolPair);
		if (!baseSymbol) return null;

		const data = await queryClient.fetchQuery({
			queryKey: keys.getCoinGeckoId(baseSymbol),
			queryFn: () => searchCoin(baseSymbol),
			staleTime: 1000 * 60 * 60,
		});

		return data.coins.find((coin) => coin.symbol.toUpperCase() === baseSymbol)?.id ?? data.coins[0]?.id ?? null;
	};

	return { findCoinId };
};
