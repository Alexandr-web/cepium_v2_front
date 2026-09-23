import type Trade from "@/models/Trade";

export const useTradeStore = defineStore("trade-store",	() => {
	const tradesMap = ref<Map<Trade["id"], Trade>>(new Map());
	const isLoaded = ref(false); // получен первый пакет от "deals"

	const getAllTrades = () => Array.from(tradesMap.value.values());
	const getTradeById = (id: Trade["id"]) => tradesMap.value.get(id);

	return { tradesMap, isLoaded, getAllTrades, getTradeById };
});
