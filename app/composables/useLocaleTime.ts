import { formatTimeAgo, type FormatTimeAgoOptions, type UseTimeAgoOptions, type UseTimeAgoReturn, type UseTimeAgoUnitNamesDefault } from "@vueuse/core";

export const useLocaleTimeAgo = (_time: MaybeRefOrGetter<Date | number | string>, _options: UseTimeAgoOptions<false, UseTimeAgoUnitNamesDefault> = {}): UseTimeAgoReturn<false> => {
	const time = computed(() => toValue(_time));
	const localDate = new Date(new Date(time.value).getTime() + 3 * 60 * 60 * 1000);
	const options = { ..._options, messages: RU_TIME_MESSAGES };

	return useTimeAgo(localDate, options);
};

export const useLocaleFormatTimeAgo = (time: Date, _options: FormatTimeAgoOptions<UseTimeAgoUnitNamesDefault> = {}): string => {
	const localDate = new Date(new Date(time).getTime() + 3 * 60 * 60 * 1000);
	const options = { ..._options, messages: RU_TIME_MESSAGES };

	return formatTimeAgo(localDate, options);
};
