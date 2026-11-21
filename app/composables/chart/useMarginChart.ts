import type { EChartsOption } from "echarts";
import { useTradeStore } from "@/store/useTradeStore";

// Максимальное количество отображаемых тикеров до группировки в категорию "Другие"
const MAX_TOP_SLICES = 5;

/**
 * Композабл для формирования конфигурации кольцевой диаграммы (ECharts)
 * и данных легенды по распределению маржи между открытыми позициями.
 *
 * Агрегирует маржу по тикерам (суммируя long и short), выделяет топ-5 позиций,
 * а остальные объединяет в сегмент "Другие".
 *
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с реактивными опциями графика и списком элементов для легенды
 */
export const useMarginChart = (_options: MaybeRefOrGetter = {}) => {
	const tradeStore = useTradeStore();

	const trades = computed(() => tradeStore.getAllTrades());
	const opts = computed(() => toValue(_options));

	const marginsMap = computed(() =>
		trades.value.reduce<Map<string, number>>((map, t) => {
			if (!Number.isFinite(t.margin) || t.margin <= 0) return map;
	
			// суммируем, т.к. по одному символу может быть несколько позиций (long + short)
			map.set(t.symbol, (map.get(t.symbol) ?? 0) + t.margin);

			return map;
		}, new Map())
	);

	const sorted = computed(() => Array.from(marginsMap.value.entries()).sort((a, b) => b[1] - a[1]));
	const top = computed(() => {
		const slices = sorted.value.slice(0, MAX_TOP_SLICES);
		const restSum = slices.slice(MAX_TOP_SLICES).reduce((sum, [_, v]) => sum + v, 0);
		
		if (restSum > 0) slices.push(["Другие", restSum]);
		
		return slices;
	});

	const seriesData = computed(() =>
		top.value.map(([name, value]) => ({
			name: extractBaseSymbol(name),
			value,
		}))
	);

	const totalSum = computed(() =>
		trades.value.reduce((sum, trade) => sum + trade.margin, 0)
	);

	const options = computed<EChartsOption>(() => ({
		color: CHART_COLORS.color.positions,
		// сумма в центре кольца
		title: {
			text: formatNum(totalSum.value, { currency: "USD", style: "currency" }),
			subtext: "Всего",
			left: "center",
			top: "middle",
			itemGap: 4,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color, fontSize: 20, fontWeight: 600 },
			subtextStyle: { color: CHART_COLORS.legend.textStyle.color, fontSize: 12 },
		},
		tooltip: {
			trigger: "item",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			formatter: (params) => {
				const item = Array.isArray(params) ? params[0] : params;
				const value = formatNum(Number(item?.value), { currency: "USD", style: "currency" });
				const percent = formatNum(Number(item?.percent) / 100, { style: "percent" });
				return `${item?.name}: <span class="font-semibold">${value} (${percent})</span>`;
			},
		},
		series: [{
			type: "pie",
			radius: ["65%", "90%"],
			center: ["50%", "50%"],
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
			data: seriesData.value,
		}],
		...opts.value,
	}));

	const legend = computed(() =>
		seriesData.value.map((item, idx) => ({
			name: String(item.name),
			percent: formatNum(totalSum.value ? item.value / totalSum.value : 0, { style: "percent" }),
			color: CHART_COLORS.color.positions[idx] ?? "",
		}))
	);

	return { options, legend };
};
