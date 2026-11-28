import { defineStore } from "pinia";

export const useCurrencyStore = defineStore("currency-store", () => {
	const rates = ref<CurrencyResponse["rates"]>({});
	const activeCurrency = ref(DEFAULT_CURRENCY);

	const activeValue = computed(() => rates.value[activeCurrency.value] ?? 1);

	return { rates, activeCurrency, activeValue };
});
