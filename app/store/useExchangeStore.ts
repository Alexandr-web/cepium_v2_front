import type Exchange from "@/models/Exchange";

export const useExchangeStore = defineStore("exchange-store",
	() => {
		const activeExchange = ref<Exchange["name"]>();
		const exchangesMap = ref<Map<Exchange["id"], Exchange>>(new Map());

		const getAllExchanges = (): Exchange[] => Array.from(exchangesMap.value.values());
		const getExchangeById = (id: Exchange["id"]): Exchange | undefined => exchangesMap.value.get(id);
		const getFilledExchanges = () => getAllExchanges()
			.filter((item) => item.filled)
			.map((item) => ({ label: item.name, value: item.name }));

		return { activeExchange, exchangesMap, getAllExchanges, getExchangeById, getFilledExchanges };
	},
	{
		persist: {
			// @ts-expect-error typescript не может определить тип path
			paths: ["activeExchange"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
