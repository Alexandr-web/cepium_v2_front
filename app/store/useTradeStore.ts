import { defineStore } from "pinia";
import Trade from "@/models/Trade";
import type { TTrade } from "@/types/api";

export const useTradeStore = defineStore("trade-store", () => {
	const _trades = ref<TTrade[]>([
		{
			timestamp: Date.now(),
			symbol: "SOL",
			margin: "isolated",
			leverage: "10",
			amount: 123.2,
			pnl: -23.2,
			entryPrice: 120,
			currentPrice: 112,
			pnlPercent: -0.2,
			id: 1,
			direction: "long",
			fullSymbol: "SOL/USDT",
		},
		{
			timestamp: Date.now(),
			symbol: "BTC",
			margin: "isolated",
			leverage: "12",
			amount: 0.23,
			pnl: 321.2,
			entryPrice: 89000,
			currentPrice: 91000,
			pnlPercent: 0.12,
			id: 2,
			direction: "short",
			fullSymbol: "BTC/USDT",
		},
	]);

	const _tradesMap = computed(() => 
		_trades.value.reduce<Map<TTrade["id"], Trade>>((map, t) => {
			if (!map.has(t.id)) map.set(t.id, new Trade(t));
			return map;
		}, new Map())
	);

	const getAllTrades = () => Array.from(_tradesMap.value.values());
	const getTradeById = (id: TTrade["id"]) => _tradesMap.value.get(id);
	
	// TODO добавить после бека метод close для закрытия поз

	return { getAllTrades, getTradeById };
});
