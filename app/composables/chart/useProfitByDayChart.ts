import { useChartScroll } from "@/composables/chart/useChartScroll";
import type { EChartsOption } from "echarts";

/**
 * Композабл для формирования конфигурации линейного графика (ECharts)
 * динамики прибыли/убытка (PnL в USD) по дням.
 *
 * Включает сглаженную кривую с градиентной заливкой области, подписи значений
 * над точками, форматирование валюты со знаком (`+` / `-`) и адаптивное правило
 * для мобильных экранов (до 768px скрывает ось Y и боковые отступы сетки).
 *
 * @param _data - Реактивный или статический массив ежедневной динамики прибыли `profit_dynamics`
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с флагом отсутствия данных (`isEmpty`) и реактивными опциями графика (`options`)
 */
export const useProfitByDayChart = (_data: MaybeRefOrGetter<StatisticsChartsResponse["data"]["profit_dynamics"] | undefined>, _options: MaybeRefOrGetter = {}) => {
	const opts = computed(() => toValue(_options));
	const data = computed(() => (toValue(_data) ?? []).map((item) => ({
		name: item.date,
		value: item.profit_usd,
	})));

	const xAxisData = computed(() => data.value.map((item) => formatLocalDate(String(item.name))));
	const seriesData = computed(() => data.value.map((item) => item.value));

	const isEmpty = computed(() => !data.value.length);

	const { dataZoom, gridBottom, gridBottomMobile } = useChartScroll(() => data.value.length);

	const options = computed<EChartsOption>(() => ({
		tooltip: {
			trigger: "axis",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			formatter: (params) => {
				const item = Array.isArray(params) ? params[0] : params;
				const n = Number(item?.value);
				const currency = formatNum(n, { currency: "USD", style: "currency" });
				const formatCurrency = formatNumberSign(n, currency);
				const className = n > 0 ? "text-tertiary-700" : (n < 0 ? "text-secondary-500" : "");
				return `${item?.name}: <span class="font-medium ${className}">${formatCurrency}</span>`;
			},
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
			axisLine: { show: false },
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
				onZero: true,
				lineStyle: { color: CHART_COLORS.yAxis.axisLine.lineStyle.color },
			},
			splitLine: {
				lineStyle: { color: CHART_COLORS.yAxis.splitLine.lineStyle.color, width: 1 },
			},
			axisLabel: {
				color: CHART_COLORS.yAxis.axisLabel.color,
				formatter: (value) => formatNum(Number(value), { currency: "USD", style: "currency" }),
				fontSize: 11,
			},
		},
		series: [{
			type: "line",
			smooth: true,
			symbol: "circle",
			symbolSize: 6,
			clip: true,
			label: {
				show: true,
				position: "top",
				distance: 8,
				color: CHART_COLORS.series.line.label.color,
				fontSize: 11,
				formatter: (params) => {
					const n = formatNum(Number(params.value), { currency: "USD", style: "currency" });
					return formatNumberSign(Number(params.value), n);
				},
			},
			itemStyle: { color: CHART_COLORS.series.line.itemStyle.color },
			lineStyle: {
				width: 3,
				color: CHART_COLORS.series.line.lineStyle.color,
				shadowBlur: 10,
				shadowColor: CHART_COLORS.series.line.lineStyle.shadowColor,
			},
			areaStyle: {
				color: {
					type: "linear",
					x: 0, y: 0, x2: 0, y2: 1,
					colorStops: [
						{ offset: 0, color: CHART_COLORS.series.line.areaStyle.color.colorStops[0] ?? "transparent" },
						{ offset: 1, color: CHART_COLORS.series.line.areaStyle.color.colorStops[1] ?? "transparent" },
					],
				},
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
		animationDurationUpdate: 300,
		animationEasingUpdate: "cubicOut",
		dataZoom: dataZoom.value,
		...opts.value,
	}));

	return { isEmpty, options };
};
