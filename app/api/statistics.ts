// сводка торговли
export const getSummary = async (): Promise<StatisticsResponse> =>
	useNuxtApp().$api("/api/statistics/summary");

// данные для графиков
export const getCharts = async (options = {}): Promise<StatisticsChartsResponse> =>
	useNuxtApp().$api("/api/metrics/charts", options);
