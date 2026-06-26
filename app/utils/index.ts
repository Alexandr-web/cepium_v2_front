type TFormatNumOptions = {
	currency?: string;
	style?: "decimal" | "currency" | "percent" | "unit";
	defaultValue?: string;
	padZero?: boolean;
};

/**
 * Превращает число в красивую строку с разделителями.
 * @param {number|string} value - Исходное число или строка
 * @param {TFormatNumOptions} options - Опции
 * @returns {string}
 */
export const formatNum = (value: number | string, options?: TFormatNumOptions): string => {
	const num = typeof value === "string" ? parseFloat(value) : value;
	const { style, currency, padZero, defaultValue = "0" } = options ?? {};

	if (isNaN(num)) return defaultValue;

	let minimumIntegerDigits = 1;

	if (padZero && Math.abs(num) >= 1) minimumIntegerDigits = 2;

	return new Intl.NumberFormat("ru-RU", {
		style,
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
		minimumIntegerDigits,
		currency,
	}).format(num);
};
