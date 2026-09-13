import { formatTimeAgo, type FormatTimeAgoOptions, type UseTimeAgoUnitNamesDefault } from "@vueuse/core";

export const useLocaleFormatTimeAgo = (time: Date, _options: FormatTimeAgoOptions<UseTimeAgoUnitNamesDefault> = {}): string => {
	const localDate = new Date(new Date(time).getTime() + 3 * 60 * 60 * 1000);
	const options = { ..._options, messages: RU_TIME_MESSAGES };

	return formatTimeAgo(localDate, options);
};
