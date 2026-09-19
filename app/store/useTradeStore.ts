import type Trade from "@/models/Trade";

export const useTradeStore = defineStore("trade-store",	() => {
	const tradesMap = ref<Map<Trade["id"], Trade>>(new Map());
	const isLoaded = ref(false); // получен первый пакет от "deals"

	const getAllTrades = () => Array.from(tradesMap.value.values());
	const getTradeById = (id: Trade["id"]) => tradesMap.value.get(id);

	const totalSum = computed(() => getAllTrades().reduce<number>((sum, trade) => sum += trade.pnl, 0));

	return { tradesMap, isLoaded, totalSum, getAllTrades, getTradeById };
});
