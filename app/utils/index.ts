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

	if (isNaN(num) || !isFinite(num) || isNegativeZero(num) || String(value).includes(",")) return defaultValue;

	if (Math.round(num * 100) / 100 === 0) return "0";

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

/**
 * Проверяет, является ли переданное значение отрицательным нулём (`-0`).
 * 
 * Использует проверку `1 / value === -Infinity`, которая работает во всех средах,
 * поддерживающих IEEE 754.
 * 
 * @param {unknown} value - Проверяемое значение.
 * @returns {boolean} `true` для `-0`, иначе `false`.
 * 
 * @example
 * isNegativeZero(-0); // true
 * isNegativeZero(0);  // false
 */
export const isNegativeZero = (value: unknown) => Object.is(value, -0);
