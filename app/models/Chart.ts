import type { EChartsOption } from "echarts";

export type TChartType = "line" | "bar" | "pie" | "scatter";

export type TChartDataPoint = {
	name: string | number;
	value: number;
	[key: string]: unknown;
};

const WEEKDAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const WEEK_ORDER_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default class Chart {
	type: TChartType;
	data: TChartDataPoint[] = [];
	customOptions: Partial<EChartsOption> = {};

	constructor(type: TChartType, data: TChartDataPoint[] = [], customOptions: Partial<EChartsOption> = {}) {
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
	static fromOrdersProfitByDay(orders: TOrder[], customOptions: Partial<EChartsOption> = {}): Chart {
		const sums = new Map<string, number>();

		WEEK_ORDER_RU.forEach((day) => sums.set(day, 0));
 
		orders
			.filter((o) => o.closedAt && typeof o.realizedPnl === "number")
			.forEach((o) => {
				const day = String(WEEKDAYS_RU[new Date(String(o.closedAt)).getDay()]);
				sums.set(day, (sums.get(day) ?? 0) + Number(o.realizedPnl));
			});
 
		const data: TChartDataPoint[] = WEEK_ORDER_RU.map((day) => ({
			name: day,
			value: Number((sums.get(day) ?? 0).toFixed(2)),
		}));
 
		return new Chart("line", data, customOptions);
	}

	// "Количество сделок" - сколько сделок по каждому символу (открытые + закрытые).
	static fromOrdersBySymbol(orders: TOrder[], customOptions: Partial<EChartsOption> = {}): Chart {
		const counts = new Map<string, number>();
 
		orders.forEach((o) => {
			const symbol = String(o.symbol);
			counts.set(symbol, (counts.get(symbol) ?? 0) + 1);
		});
 
		const data: TChartDataPoint[] = Array.from(counts.entries())
			.sort((a, b) => b[1] - a[1])
			.map(([symbol, count]) => ({ name: symbol, value: count }));
 
		return new Chart("bar", data, customOptions);
	}

	// "Соотношение Win/Loss" - сколько закрытых сделок ушло в плюс/минус.
	static fromOrdersWinLoss(orders: TOrder[], customOptions: Partial<EChartsOption> = {}): Chart {
		const closed = orders.filter((o) => o.closedAt && typeof o.realizedPnl === "number");
		const wins = closed.filter((o) => Number(o.realizedPnl) > 0).length;
		const losses = closed.length - wins;
 
		const data: TChartDataPoint[] = [
			{ name: "Прибыльные", value: wins },
			{ name: "Убыточные", value: losses },
		];
 
		return new Chart("pie", data, customOptions);
	}
};
