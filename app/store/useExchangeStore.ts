import { defineStore } from "pinia";
import Exchange from "@/models/Exchange";

export const useExchangeStore = defineStore("exchange-store",
	() => {
		const exchanges = ref<TExchange[]>([]);
		const activeExchange = ref<TExchange["name"]>();

		const exchangesMap = computed(() => 
			exchanges.value.reduce<Map<TExchange["id"], Exchange>>((map, i) => {
				if (!map.has(i.id)) map.set(i.id, new Exchange(i));
				return map;
			}, new Map())
		);

		const getAllExchanges = (): Exchange[] => Array.from(exchangesMap.value.values());
		const getExchangeById = (id: TExchange["id"]): Exchange | undefined => exchangesMap.value.get(id);
		
		return { exchanges, activeExchange, getAllExchanges, getExchangeById };
	},
	{
		persist: {
			// @ts-expect-error typescript не может определить тип path
			paths: ["activeExchange"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
