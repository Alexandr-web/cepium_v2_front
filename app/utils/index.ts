import type { FetchError } from "ofetch";

type FormatNumOptions = {
	currency?: string;
	style?: "decimal" | "currency" | "percent" | "unit";
	defaultValue?: string;
	padZero?: boolean;
};

/**
 * Превращает число в красивую строку с разделителями.
 * @param {number|string} _value - Исходное число или строка
 * @param {FormatNumOptions} options - Опции
 * @returns {string}
 */
export const formatNum = (_value: number | string, options?: FormatNumOptions): string => {
	const num = typeof _value === "string" ? parseFloat(_value.replace(",", ".")) : _value;
	const { style, currency, padZero, defaultValue = "0" } = options ?? {};

	if (!isNumber(num) || !isFinite(num) || isNegativeZero(num) || !_value) return defaultValue;

	let minimumIntegerDigits = 1;
	let maximumFractionDigits = 2;

	if (padZero && Math.abs(num) >= 1) minimumIntegerDigits = 2;

	if (Math.abs(num) < 0.01) {
		const absNum = Math.abs(num);
		maximumFractionDigits = Math.min(20, Math.ceil(-Math.log10(absNum)) + 1);
	}

	return new Intl.NumberFormat("ru-RU", {
		style,
		minimumFractionDigits: 0,
		maximumFractionDigits,
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
 * Собирает URL аватара пользователя.
 *
 * Бэкенд возвращает имя файла (например, `avatar-default.jpg`). Blob- и уже
 * абсолютные URL возвращаются без изменений, чтобы не ломать локальное превью
 * выбранного файла. Без имени файла возвращается пустая строка — тогда
 * `AImage` покажет заглушку вместо битого пути.
 *
 * @param {string | undefined} apiUrl - База API (например, `/api`).
 * @param {string | null | undefined} avatar - Имя файла или готовый URL.
 * @returns {string} URL аватара либо пустая строка.
 *
 * @example
 * getAvatarUrl("/api", "user.jpg"); // "/api/users/me/avatars/user.jpg"
 * getAvatarUrl("/api", null);       // ""
 */
export const getAvatarUrl = (apiUrl: string | undefined, avatar?: string | null): string => {
	if (!apiUrl || !avatar) return "";
	if (avatar.startsWith("blob:") || avatar.startsWith("http")) return avatar;
	return `${apiUrl}/users/me/avatars/${avatar}`;
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

type FormatIsoToPrettyStrOptions = {
	type?: "dmy" | "default" | "hms",
};

/**
 * Преобразует ISO-строку даты в отформатированную строку с датой и/или временем.
 * Входное время в формате UTC (Z) автоматически переводится в локальное время пользователя
 * (используется локальный часовой пояс среды выполнения).
 *
 * @param {string} isoString - Строка даты в формате ISO (например, "2026-07-28T16:15:22Z").
 * @param {FormatIsoToPrettyStrOptions} [options] - Опции форматирования.
 * @param {"dmy" | "hms"} [options.type] - Тип возвращаемого формата:
 *   - "dmy" — только дата в формате "DD-MM-YYYY";
 *   - "hms" — только время в формате "HH:mm:ss";
 *   - если не указан — дата и время в формате "DD-MM-YYYY HH:mm:ss".
 * @returns {string} Отформатированная строка даты/времени, либо пустая строка,
 *   если переданная строка не может быть распознана как дата.
 *
 * @example
 * formatIsoToPrettyStr("2026-07-28T16:15:22Z");
 * // "28-07-2026 19:15:22" (для часового пояса GMT+3)
 *
 * @example
 * formatIsoToPrettyStr("2026-07-28T16:15:22Z", { type: "dmy" });
 * // "28-07-2026"
 *
 * @example
 * formatIsoToPrettyStr("2026-07-28T16:15:22Z", { type: "hms" });
 * // "19:15:22"
 *
 * @example
 * formatIsoToPrettyStr("invalid-date");
 * // ""
 */
export const formatIsoToPrettyStr = (isoString: string, options: FormatIsoToPrettyStrOptions = {}): string => {
	const date = new Date(isoString);

	if (!isNumber(date.getTime())) return "";

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	switch (options.type) {
		case "dmy":
			return `${day}-${month}-${year}`;
		case "hms":
			return `${hours}:${minutes}:${seconds}`;
		default:
			return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
	}
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

/**
 * Форматирует технические сообщения об ошибках в понятный для пользователя текст.
 * 
 * Функция проверяет текст ошибки с помощью регулярного выражения и, 
 * в случае совпадения (например, при рассинхронизации времени с сервером), 
 * возвращает локализованное сообщение на русском языке.
 *
 * @param {string} message - Исходное (техническое) сообщение об ошибке.
 * @returns {string} Локализованное сообщение для пользователя или исходный текст, если совпадений нет.
 */
export const prettyError = (message: string) => {
	if (/before\ssecure\stls\sconnection\swas\sestablished/i.test(message)) {
		return "Сбой защищенного соединения. Проверьте интернет или отключите VPN и попробуйте снова";
	}

	if (/connect\stimeout\serror/i.test(message)) {
		return "Время ожидания сети истекло. Перезагрузите страницу";
	}

	if (/other\sside\sclosed/i.test(message)) {
		return "Сервер закрыл подключение. Пожалуйста, убедитесь, что интернет работает стабильно, и попробуйте перезагрузить страницу";
	}

	return message;
};

/**
 * Извлекает и форматирует сообщение об ошибке из сырого ответа биржи, 
 * позволяя игнорировать определенные коды ошибок.
 *
 * @param {unknown} rawData - Сырые данные ошибки (ожидается строка с префиксом или JSON).
 * @returns {string} Очищенный текст ошибки, исходная строка или пустая строка, если ошибка в списке исключений.
 */
export const parseExchangeErrorMessage = (rawData: unknown): string => {
	if (typeof rawData !== "string") return "";

	try {
		const parsed = JSON.parse(rawData);

		if (Number(parsed.retCode) === 10002) return "";
		
		return prettyError(parsed.message || parsed.retMsg || rawData);
	} catch {
		return prettyError(rawData);
	}
};

/**
 * Извлекает базовый символ из торговой пары вида "BTC/USDT".
 *
 * @param {string} pair - Строка пары (например, "BTC/USDT").
 * @returns {string} Базовый символ в верхнем регистре или пустая строка.
 *
 * @example
 * extractBaseSymbol("BTC/USDT"); // "BTC"
 * extractBaseSymbol("btc/usdt"); // "BTC"
 */
export const extractBaseSymbol = (pair: string): string => pair.split("/")[0]?.trim().toUpperCase() ?? "";

/**
 * Генерирует URL иконки монеты из CDN Binance Icons.
 *
 * @param {string} symbol - Торговая пара (например, "BTC/USDT").
 * @returns {string} URL SVG-иконки.
 *
 * @example
 * getUrlCoinIcon("BTC/USDT");
 * // "https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/btc.svg"
 */
export const getUrlCoinIcon = (symbol: string) => `https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/${extractBaseSymbol(symbol).toLowerCase()}.svg`;

/**
 * Проверяет, что переданный ключ действительно существует в объекте,
 * и сужает тип ключа до `keyof T` для дальнейшей безопасной индексации.
 *
 * @template T Тип объекта
 * @param obj Объект, в котором проверяется наличие ключа
 * @param key Проверяемый ключ
 * @returns `true`, если ключ присутствует в объекте (с сужением типа до `keyof T`)
 */
export const hasKey = <T extends object>(obj: T, key: PropertyKey): key is keyof T => key in obj;

/**
 * Проверяет, совпадает ли дата из ISO-строки с текущей (UTC).
 *
 * @param {string} _date - ISO-строка даты (например, "2026-07-28T16:15:22Z").
 * @returns {boolean} `true`, если год, месяц и день совпадают с текущим UTC-днем.
 *
 * @example
 * isCurrentDate(new Date().toISOString()); // true
 */
export const isCurrentDate = (_date: string) => {
	const date = new Date(_date);
	const now = new Date();

	return date.getUTCFullYear() === now.getUTCFullYear() &&
			date.getUTCMonth() === now.getUTCMonth() &&
			date.getUTCDate() === now.getUTCDate();
};

/**
 * Форматирует значение, добавляя знак плюс "+" для положительных чисел.
 * 
 * Если числовое представление `val` строго больше нуля, функция возвращает строку с префиксом "+".
 * В противном случае возвращает строковое представление значения.
 * Можно передать альтернативное значение `output` для вывода вместо оригинального `val`.
 *
 * @param {number | string} val - Исходное значение или число, знак которого проверяется.
 * @param {string | number} [output] - Альтернативное значение для вывода (если не передано, используется `val`).
 * @returns {string} Строка с добавленным знаком плюс (если число > 0) или исходное/альтернативное значение в виде строки.
 *
 * @example
 * formatNumberSign(5);         // Возвращает "+5"
 * formatNumberSign(-3);        // Возвращает "-3"
 * formatNumberSign(0);         // Возвращает "0"
 * formatNumberSign("10");      // Возвращает "+10"
 * 
 * @example
 * // Использование кастомного output:
 * formatNumberSign(15, "15%"); // Возвращает "+15%"
 * formatNumberSign(-5, "5"); // Возвращает "5"
 */
export const formatNumberSign = (val: number | string, output?: string | number) => {
	return Number(val) > 0 ? "+" + (output ?? val) : String(output ?? val);
};

/**
 * Преобразует массив фильтров в объект-запрос, где ключи - имена фильтров,
 * а значения - их строковое представление.
 *
 * @param filters - массив объектов FilterItem с полями name и value
 * @returns объект, маппящий имя фильтра на его строковое значение
 *
 * @example
 * getFiltersQuery([
 *   { name: "status", value: "active" },
 *   { name: "days", value: true },
 * ]);
 * // Возвращает: { status: "active", days: "true" }
 */
export const getFiltersQuery = (filters: FilterItem[]) => {
	return filters.reduce<Record<string, string>>((query, filter) => {
		query[filter.name] = String(filter.value);
		return query;
	}, {});
};

/**
 * Проверяет, является ли значение конечным числом (не NaN, не Infinity, не -Infinity).
 *
 * @example
 * isNumber(42)          // true
 * isNumber(NaN)         // false
 * isNumber("123")       // false — строка, а не number
 * isNumber(Infinity)    // false
 * isNumber(null)        // false
 */
export const isNumber = (v: unknown) => typeof v === "number" && isFinite(v);
