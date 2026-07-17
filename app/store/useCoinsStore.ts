import { defineStore } from "pinia";
import Coin from "@/models/Coin";

export const useCoinsStore = defineStore("coins-store", () => {
	const _coins = ref<TCoin[]>([
		{
			timestamp: Date.now(),
			symbol: "SOL",
			id: 1,
			fullSymbol: "SOL/USDT",
			change24hprct: 0.21,
			price24h: 214,
			volume24h: 321312,
			currentPrice: 212,
		},
		{
			timestamp: Date.now(),
			symbol: "BTC",
			id: 2,
			fullSymbol: "BTC/USDT",
			change24hprct: -0.02,
			price24h: 98000,
			volume24h: 2231312,
			currentPrice: 81000,
		},
	]);

	const _coinsMap = computed(() => 
		_coins.value.reduce<Map<TCoin["id"], Coin>>((map, t) => {
			if (!map.has(t.id)) map.set(t.id, new Coin(t));
			return map;
		}, new Map())
	);

	const getAllCoins = () => Array.from(_coinsMap.value.values());
	const getCoinById = (id: TCoin["id"]) => _coinsMap.value.get(id);
	
	return { getAllCoins, getCoinById };
});
