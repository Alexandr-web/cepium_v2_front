import { defineStore } from "pinia";
import Exchange from "@/models/Exchange";

export const useExchangeStore = defineStore("exchange-store", () => {
	const exchanges = ref<TExchange[]>([]);

	const exchangesMap = computed(() => 
		exchanges.value.reduce<Map<TExchange["id"], Exchange>>((map, i) => {
			if (!map.has(i.id)) map.set(i.id, new Exchange(i));
			return map;
		}, new Map())
	);

	const getAllExchanges = () => Array.from(exchangesMap.value.values());
	const getExchangeById = (id: TExchange["id"]) => exchangesMap.value.get(id);
	
	return { getAllExchanges, getExchangeById, exchanges };
});
