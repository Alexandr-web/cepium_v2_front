import { defineStore } from "pinia";
import Exchange from "@/models/Exchange";

export const useExchangeStore = defineStore("exchange-store", () => {
	const _exchange = ref<TExchange[]>([
		{ name: "Bybit", id: "bybit", credentials: [] },
		{ name: "OKX", id: "okx", credentials: [] },
		{ name: "Binance", id: "binance", credentials: [] },
	]);

	const _exchangeMap = computed(() => 
		_exchange.value.reduce<Map<TExchange["id"], Exchange>>((map, i) => {
			if (!map.has(i.id)) map.set(i.id, new Exchange(i));
			return map;
		}, new Map())
	);

	const getAllExchange = () => Array.from(_exchangeMap.value.values());
	const getExchangeById = (id: TExchange["id"]) => _exchangeMap.value.get(id);
	
	return { getAllExchange, getExchangeById };
});
