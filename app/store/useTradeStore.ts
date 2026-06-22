import { defineStore } from "pinia";
import Trade from "@/models/Trade";
import type { TTrade } from "@/types/api";

const mockTrades: TTrade[] = [
	{
		symbol: "SOL",
		margin: "isolated",
		leverage: "10",
		amount: 123.2,
		pnl: -23.2,
		entryPrice: 120,
		currentPrice: 112,
	},
	{
		symbol: "BTC",
		margin: "isolated",
		leverage: "12",
		amount: 0.23,
		pnl: 321.2,
		entryPrice: 89000,
		currentPrice: 91000,
	},
];

export const useTradeStore = defineStore("trade-store", () => {
	const trades = ref(mockTrades.map((t) => new Trade(t)));

	// TODO добавить после бека fetch метод для актуальных данных
	// также метод close для закрытия поз

	return { trades };
});
