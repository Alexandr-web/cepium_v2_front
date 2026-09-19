export const useExchangeStore = defineStore("exchange-store",
	() => {
		const activeExchange = ref<ExchangeDto["name"]>("");

		return { activeExchange };
	},
	{
		persist: {
			pick: ["activeExchange"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
