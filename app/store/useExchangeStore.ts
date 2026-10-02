export const useExchangeStore = defineStore("exchange-store", () => {
	const activeExchange = useCookie<ExchangeDto["name"]>("activeExchange", { default: () => "" });

	return { activeExchange };
});
