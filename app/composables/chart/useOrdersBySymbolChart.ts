import { useChartScroll } from "@/composables/chart/useChartScroll";
import type { EChartsOption } from "echarts";

/**
 * Композабл для формирования конфигурации столбчатой диаграммы (ECharts)
 * по распределению количества сделок (ордеров) по торговым инструментам.
 *
 * Включает адаптивное правило (`media`): на экранах шириной до 768px скрывает
 * ось Y и убирает боковые отступы сетки.
 *
 * @param _data - Реактивный или статический массив статистики сделок по активам
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с флагом отсутствия данных (`isEmpty`) и реактивными опциями графика (`options`)
 */
export const useOrdersBySymbolChart = (_data: MaybeRefOrGetter<StatisticsChartsResponse["data"]["trades_by_asset"] | undefined>, _options: MaybeRefOrGetter = {}) => {
	const opts = computed(() => toValue(_options));
	const data = computed(() => (toValue(_data) ?? []).map((item) => ({
		name: item.asset,
		value: item.count,
	})));

	const xAxisData = computed(() => data.value.map((item) => item.name));
	const seriesData = computed(() => data.value.map((item) => item.value).reverse());

	const isEmpty = computed(() => !data.value.length);

	const { dataZoom, gridBottom, gridBottomMobile } = useChartScroll(() => data.value.length);

	const options = computed<EChartsOption>(() => ({
		tooltip: {
			trigger: "axis",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
		},
		grid: {
			top: "15%",
			left: "3%",
			right: "3%",
			bottom: gridBottom.value,
			containLabel: true,
		},
		xAxis: {
			type: "category",
			data: xAxisData.value,
			axisLine: {
				lineStyle: { color: CHART_COLORS.xAxis.axisLine.lineStyle.color },
			},
			axisTick: { show: false },
			axisLabel: {
				color: CHART_COLORS.xAxis.axisLabel.color,
				margin: 12,
				fontSize: 11,
			},
		},
		yAxis: {
			type: "value",
			axisLine: {
				lineStyle: { color: CHART_COLORS.yAxis.axisLine.lineStyle.color },
			},
			splitLine: {
				lineStyle: { color: CHART_COLORS.yAxis.splitLine.lineStyle.color, width: 1 },
			},
		},
		series: [{
			type: "bar",
			barWidth: "40%",
			label: {
				show: true,
				position: "top",
				distance: 8,
				color: CHART_COLORS.series.bar.label.color,
				fontSize: 12,
			},
			itemStyle: {
				color: CHART_COLORS.series.bar.itemStyle.color,
				borderColor: CHART_COLORS.series.bar.itemStyle.borderColor,
				borderRadius: [6, 6, 0, 0],
			},
			data: seriesData.value,
		}],
		media: [
			{
				query: {
					maxWidth: 768,
				},
				option: {
					yAxis: {
						show: false,
					},
					grid: {
						top: 30,
						bottom: gridBottomMobile.value,
						left: 0,
						right: 0,
						containLabel: false,
					},
					dataZoom: [
						{},
						{ left: 0, right: 0 },
					],
				},
			},
		],
		dataZoom: dataZoom.value,
		animationDurationUpdate: 300,
		animationEasingUpdate: "cubicOut",
		...opts.value,
	}));

	return { isEmpty, options };
};
