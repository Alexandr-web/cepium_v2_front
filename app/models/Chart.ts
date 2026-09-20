import type { EChartsOption } from "echarts";
import type Trade from "@/models/Trade";

export type ChartType = "line" | "bar" | "pie" | "scatter";

export type ChartDataPoint = {
	name: string | number;
	value: number;
	[key: string]: unknown;
};

const WEEKDAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const WEEK_ORDER_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// максимум секторов в диаграмме, остальные схлопываются в "другие"
const MAX_MARGIN_SLICES = 5;

export default class Chart {
	type: ChartType;
	data: ChartDataPoint[] = [];
	customOptions: Partial<EChartsOption> = {};

	constructor(type: ChartType, data: ChartDataPoint[] = [], customOptions: Partial<EChartsOption> = {}) {
		this.type = type;
		this.data = data;
		this.customOptions = customOptions;
	}

	getComputedOptions(): EChartsOption {
		const xAxisData = this.data.map((item) => item.name);
		const seriesData = this.data.map((item) => item.value);

		const baseOptions: EChartsOption = {
			grid: {
				top: 30,
				bottom: 20,
				left: 40,
				right: 20,
				containLabel: true,
			},
			tooltip: {
				backgroundColor: CHART_COLORS.tooltip.backgroundColor,
				borderColor: CHART_COLORS.tooltip.borderColor,
				borderWidth: 1,
				textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			},
			series: [],
		};

		if (this.type !== "pie") {
			Object.assign(baseOptions, {
				yAxis: {
					type: "value",
					splitLine: {
						lineStyle: {
							color: CHART_COLORS.yAxis.splitLine.lineStyle.color, 
							width: 1,
						},
					},
					axisLabel: {
						color: CHART_COLORS.yAxis.axisLabel.color,
						fontSize: 11,
					},
				},
				xAxis: {
					type: "category",
					data: xAxisData,
					axisLine: {
						lineStyle: { color: CHART_COLORS.xAxis.axisLine.lineStyle.color },
					},
					axisTick: { show: false },
					axisLabel: {
						color: CHART_COLORS.xAxis.axisLabel.color,
						fontSize: 11,
					},
				},
				tooltip: {
					trigger: "axis",
					backgroundColor: CHART_COLORS.tooltip.backgroundColor,
					borderColor: CHART_COLORS.tooltip.borderColor,
					borderWidth: 1,
					textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
				},
				series: [
					{
						type: this.type,
						data: seriesData,
					},
				],
			});
		} else {
			Object.assign(baseOptions, {
				tooltip: {
					trigger: "item",
					backgroundColor: CHART_COLORS.tooltip.backgroundColor,
					borderColor: CHART_COLORS.tooltip.borderColor,
					borderWidth: 1,
					textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
				},
				series: [
					{
						type: "pie",
						// Передаем весь массив объектов (ECharts сам возьмет оттуда name и value)
						data: this.data.map((item) => ({
							name: String(item.name),
							value: item.value,
						})),
					},
				],
			});
		}

		// берем базовые опции и аккуратно накладываем кастомные.
		// Если в customOptions есть свойства для series, объединяем их, а не затираем.
		const finalOptions = { ...baseOptions, ...this.customOptions };
		
		if (this.customOptions.series && Array.isArray(this.customOptions.series) && Array.isArray(baseOptions.series)) {
			Object.assign(finalOptions, {
				series: [
					{
						...baseOptions.series?.[0],
						...this.customOptions.series[0],
					},
				],
			});
		}

		return finalOptions;
	}

	// "Динамика профита" - сумма realizedPnl по дням недели (Пн→Вс), только закрытые сделки.
	static fromOrdersProfitByDay(orders: Order[], customOptions: Partial<EChartsOption> = {}): Chart {
		const sums = new Map<string, number>();

		WEEK_ORDER_RU.forEach((day) => sums.set(day, 0));
 
		orders.forEach((o) => {
			if (!o.closedAt || typeof o.realizedPnl !== "number") return;

			const day = new Date(String(o.closedAt)).getDay();
			const orderDay = String(WEEKDAYS_RU[day]);
			const sum = (sums.get(orderDay) ?? 0) + Number(o.realizedPnl);

			sums.set(orderDay, sum);
		});
 
		const data: ChartDataPoint[] = WEEK_ORDER_RU.map((day) => ({
			name: day,
			value: Number((sums.get(day) ?? 0).toFixed(2)),
		}));
 
		return new Chart("line", data, customOptions);
	}

	// "Количество сделок" - сколько сделок по каждому символу (открытые + закрытые).
	static fromOrdersBySymbol(orders: Order[], customOptions: Partial<EChartsOption> = {}): Chart {
		const counts = new Map<string, number>();
 
		orders.forEach((o) => {
			const symbol = String(o.symbol);
			counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
		});
 
		const data: ChartDataPoint[] = Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1])
			.map(([symbol, count]) => ({ name: symbol, value: count }));
 
		return new Chart("bar", data, customOptions);
	}

	// "Соотношение Win/Loss" - сколько закрытых сделок ушло в плюс/минус.
	static fromOrdersWinLoss(orders: Order[], customOptions: Partial<EChartsOption> = {}): Chart {
		const closed = orders.filter((o) => o.closedAt && typeof o.realizedPnl === "number");
		const wins = closed.filter((o) => Number(o.realizedPnl) > 0);
		const losses = closed.length - wins.length;
 
		const data: ChartDataPoint[] = [
			{ name: "Прибыльные", value: wins.length },
			{ name: "Убыточные", value: losses },
		];
 
		return new Chart("pie", data, customOptions);
	}

	// "Доля маржи" - какую часть используемой маржи занимает каждая активная позиция.
	static fromTradesByMargin(trades: Trade[], usedMargin: number, customOptions: Partial<EChartsOption> = {}): Chart {
		const marginsMap = new Map<string, number>();

		trades.forEach((t) => {
			if (!Number.isFinite(t.margin) || t.margin <= 0) return;

			// суммируем, т.к. по одному символу может быть несколько позиций (long + short)
			marginsMap.set(t.symbol, (marginsMap.get(t.symbol) ?? 0) + t.margin);
		});

		const sorted = Array.from(marginsMap.entries()).sort((a, b) => b[1] - a[1]);
		const top = sorted.slice(0, MAX_MARGIN_SLICES);
		const restSum = sorted.slice(MAX_MARGIN_SLICES).reduce((sum, [_, v]) => sum + v, 0);

		if (restSum > 0) top.push(["Другие", restSum]);

		const data: ChartDataPoint[] = top.map(([name, value]) => ({
			name: extractBaseSymbol(name),
			value,
		}));

		const defaults: Partial<EChartsOption> = {
			color: CHART_COLORS.color.positions,
			// сумма в центре кольца
			title: {
				text: formatNum(usedMargin, { currency: "USD", style: "currency" }),
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
					return `${item?.name}: <span class="font-semibold">${value} (${item?.percent}%)</span>`;
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
					borderRadius: 6,
					borderColor: CHART_COLORS.series.pie.itemStyle.borderColor,
					borderWidth: 3,
				},
				emphasis: {
					scale: true,
					scaleSize: 6,
					itemStyle: {
						shadowBlur: 15,
						shadowColor: CHART_COLORS.series.pie.emphasis.itemStyle.shadowColor,
					},
				},
			}],
		};

		// кастомные опции накладываются поверх дефолтных (series[0] - слиянием, как в getComputedOptions)
		const options = { ...defaults, ...customOptions };

		if (Array.isArray(customOptions.series) && Array.isArray(defaults.series)) {
			Object.assign(options, {
				series: [{ ...defaults.series[0], ...customOptions.series[0] }],
			});
		}

		return new Chart("pie", data, options);
	}
};
