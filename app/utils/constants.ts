import type { UseTimeAgoMessages } from "@vueuse/core";

export const VERSION = "v2.0";
export const MAX_SIZE_FILE_AVATAR = 5 * 1024 * 1024; // 5 мб
export const RU_TIME_MESSAGES: UseTimeAgoMessages = {
	justNow: "только что",
	invalid: "некорректная дата",
	past: (n: number | string) => {
		const s = String(n);
		return s.match(/\d+/) ? `${s} назад` : s;
	},
	future: (n: number | string) => {
		const s = String(n);
		return s.match(/\d+/) ? `через ${s}` : s;
	},
	month: (n: number) => n === 1 ? "месяц" : `${n} мес.`,
	year: (n: number) => n === 1 ? "год" : `${n} г.`,
	day: (n: number, past?: boolean) => n === 1 ? (past ? "вчера" : "завтра") : `${n} дн.`,
	week: (n: number) => n === 1 ? "неделю" : `${n} нед.`,
	hour: (n: number) => `${n} ч.`,
	minute: (n: number) => `${n} мин.`,
	second: (n: number) => `${n} сек.`,
};
