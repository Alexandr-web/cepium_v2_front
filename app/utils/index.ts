import type { FetchError } from "ofetch";

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

/**
 * Преобразует входное значение в строку URL.
 * 
 * Если передана строка, возвращает её без изменений.
 * Если передан файл, создает для него временный Blob-URL.
 * 
 * @important 
 * Если функция создает Blob-URL (`URL.createObjectURL`), этот URL остается в памяти, 
 * пока документ открыт. Не забывайте освобождать память с помощью `URL.revokeObjectURL(url)`, 
 * когда ссылка больше не нужна.
 *
 * @param {unknown} val - Входное значение.
 * @returns {string} Строка URL или пустая строка, если значение отсутствует.
 */
export const getURLFile = (val: unknown): string => {
	if (typeof val === "string") return val;
	if (val instanceof File) return  URL.createObjectURL(val);
	return "";
};

/**
 * Форматирует миллисекунды в строку минут и секунд вида "М:СС" или "ММ:СС".
 * 
 * @param {number} ms - Количество миллисекунд для форматирования.
 * @returns {string} Строка времени в формате "минуты:секунды" (например, "1:00", "10:05").
 * 
 * @example
 * formatTime(60000);   // "1:00"
 * formatTime(65000);   // "1:05"
 * formatTime(605000);  // "10:05"
 */
export const formatTime = (ms: number): string => {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Извлекает строку сообщения об ошибке из объекта ошибки запроса `FetchError`.
 * 
 * Функция обрабатывает два формата ответа от API:
 * 1. Если `message` является строкой, возвращает её.
 * 2. Если `message` является массивом строк (например, ошибки валидации), возвращает первый элемент.
 *
 * @param {FetchError} err - Объект ошибки, полученный при выполнении запроса через `ofetch`.
 * @returns {string} Строка с текстом ошибки. Если сообщение отсутствует или структура пуста, возвращает пустую строку `""`.
 *
 * @example
 * // Пример со строкой: { data: { message: "Неверный пароль" } }
 * const msg = getRequestErrorMessage(error); // "Неверный пароль"
 *
 * @example
 * // Пример с массивом: { data: { message: ["Email обязателен", "Пароль слишком короткий"] } }
 * const msg = getRequestErrorMessage(error); // "Email обязателен"
 */
export const getRequestErrorMessage = (err: FetchError): string => {
	const message = err.data.message;
	return !Array.isArray(message) ? message : message?.at(0) ?? "";
};
