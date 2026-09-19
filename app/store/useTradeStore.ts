import type Trade from "@/models/Trade";

export const useTradeStore = defineStore("trade-store",	() => {
	const trades = ref<Trade[]>([]);
	const isLoaded = ref(false); // получен первый пакет от "deals"

	return { trades, isLoaded };
});
