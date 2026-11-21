import type { EChartsOption } from "echarts";

/**
 * Композабл для формирования конфигурации кольцевой диаграммы (ECharts)
 * по соотношению прибыльных и убыточных сделок (win/loss ratio).
 *
 * Использует вертикальные линейные градиенты из палитры `CHART_COLORS.color.pie`
 * и выводит встроенную легенду в нижней части графика.
 *
 * @param _data - Реактивный или статический объект статистики `win_loss_ratio`
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с флагом отсутствия данных (`isEmpty`) и реактивными опциями графика (`options`)
 */
export const useOrdersWinLossChart = (_data: MaybeRefOrGetter<StatisticsChartsResponse["data"]["win_loss_ratio"] | undefined>, _options: MaybeRefOrGetter = {}) => {
	const opts = computed(() => toValue(_options));
	const data = computed(() => {
		const ratio = toValue(_data);
		return [
			{ name: "Прибыльные", value: Number(ratio?.profitable_count ?? 0) },
			{ name: "Убыточные", value: Number(ratio?.loss_count ?? 0) },
		];
	});

	const isEmpty = computed(() => !data.value.some((item) => isNumber(item.value) && item.value > 0));
	const options = computed<EChartsOption>(() => ({
		grid: {
			top: 30,
			bottom: 20,
			left: 40,
			right: 20,
			containLabel: true,
		},
		color: [
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: CHART_COLORS.color.pie[0]?.colorStops[0] ?? "transparent" },
					{ offset: 1, color: CHART_COLORS.color.pie[0]?.colorStops[1] ?? "transparent" },
				],
			},
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: CHART_COLORS.color.pie[1]?.colorStops[0] ?? "transparent" },
					{ offset: 1, color: CHART_COLORS.color.pie[1]?.colorStops[1] ?? "transparent" },
				],
			},
		],
		tooltip: {
			trigger: "item",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			formatter: (params) => {
				const item = Array.isArray(params) ? params[0] : params;
				const value = formatNum(Number(item?.value), { padZero: true });
				const percent = formatNum(Number(item?.percent) / 100, { style: "percent" });
				return `${item?.name}: <span class="font-semibold">${value} шт. (${percent})</span>`;
			},
		},
		legend: {
			show: true,
			bottom: 0,
			icon: "circle",
			itemWidth: 10,
			itemGap: 20,
			textStyle: {
				color: CHART_COLORS.legend.textStyle.color,
				fontSize: 13,
			},
		},
		series: [{
			type: "pie",
			radius: ["60%", "78%"],
			center: ["50%", "45%"],
			avoidLabelOverlap: true,
			label: { show: false },
			labelLine: { show: false },
			itemStyle: {
				borderWidth: 0,
			},
			emphasis: {
				scale: true,
				scaleSize: 6,
				itemStyle: {
					shadowBlur: 15,
					shadowColor: CHART_COLORS.series.pie.emphasis.itemStyle.shadowColor,
				},
			},
			data: data.value,
		}],
		...opts.value,
	}));

	return { isEmpty, options };
};
