import { useCurrencyStore } from "@/store/useCurrencyStore";

/**
 * Композабл для конвертации и форматирования числовых значений в активную валюту приложения.
 *
 * @returns Объект с методами для работы с валютой.
 */
export const useCurrency = () => {
	const currencyStore = useCurrencyStore();

	const formatNumCurrency = (_val: string | number, options = {}) => {
		const val = Number(_val) * currencyStore.activeValue;

		return formatNum(val, {
			currency: currencyStore.activeCurrency,
			style: "currency",
			maximumFractionDigits: 4,
			...options,
		});
	};

	return { formatNumCurrency };
};
