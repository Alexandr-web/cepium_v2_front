import Exchange from "@/models/Exchange";

export const useExchangeStore = defineStore("exchange-store",
	() => {
		const exchanges = ref<Exchange[]>([]);
		const activeExchange = ref<Exchange["name"]>();

		const exchangesMap = computed<Map<Exchange["id"], Exchange>>(() => new Map(exchanges.value.map((i) => [i.id, new Exchange(i)])));

		const getAllExchanges = (): Exchange[] => Array.from(exchangesMap.value.values());
		const geExchangeById = (id: Exchange["id"]): Exchange | undefined => exchangesMap.value.get(id);
		const getFilledExchanges = () => getAllExchanges()
			.filter((item) => item.filled)
			.map((item) => ({ label: item.name, value: item.name }));

		return { exchanges, activeExchange, getAllExchanges, geExchangeById, getFilledExchanges };
	},
	{
		persist: {
			// @ts-expect-error typescript не может определить тип path
			paths: ["activeExchange"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
