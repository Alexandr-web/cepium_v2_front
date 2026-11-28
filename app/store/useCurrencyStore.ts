import { defineStore } from "pinia";

export const useCurrencyStore = defineStore("currency-store", () => {
	const rates = ref<CurrencyResponse["rates"]>({});
	const activeCurrency = useCookie("currency", {
		default: () => DEFAULT_CURRENCY,
		sameSite: "lax",
		watch: true,
	});

	const activeValue = computed(() => rates.value[activeCurrency.value] ?? 1);

	return { rates, activeCurrency, activeValue };
});
