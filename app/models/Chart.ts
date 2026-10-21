import type { EChartsOption } from "echarts";
import type Trade from "@/models/Trade";

export type ChartType = "line" | "bar" | "pie" | "scatter";

export type ChartDataPoint = {
	name: string | number;
	value: number;
	[key: string]: unknown;
};

// максимум секторов в диаграмме, остальные схлопываются в "другие"
const MAX_TOP_SLICES = 5;

const getAssignOptions = (defaults: Partial<EChartsOption>, customOptions: Partial<EChartsOption>) => {
	// кастомные опции накладываются поверх дефолтных (series[0] - слиянием, как в getComputedOptions)
	const options = { ...defaults, ...customOptions };

	if (Array.isArray(customOptions.series) && Array.isArray(defaults.series)) {
		Object.assign(options, {
			series: [{ ...defaults.series[0], ...customOptions.series[0] }],
		});
	}

	return options;
};

export default class Chart {
	type: ChartType;
	data: ChartDataPoint[] = [];
	customOptions: Partial<EChartsOption> = {};
	isEmpty: boolean;

	constructor(type: ChartType, data: ChartDataPoint[] = [], customOptions: Partial<EChartsOption> = {}, isEmpty = false) {
		this.type = type;
		this.data = data;
		this.customOptions = customOptions;
		this.isEmpty = isEmpty;
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
								bottom: 20,
								left: 0,
								right: 0,
								containLabel: false,
							},
						},
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

		return getAssignOptions(baseOptions, this.customOptions);
	}

	// "Динамика профита" - профит по дням недели (Пн→Вс), данные с бэкенда.
	static fromOrdersProfitByDay(
		data: ProfitDynamicsItem[],
		customOptions: Partial<EChartsOption> = {}
	): Chart {
		const chartData: ChartDataPoint[] = data.map((item) => ({
			name: item.day_of_week,
			value: item.profit_usd,
		}));

		const defaults: Partial<EChartsOption> = {
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
				bottom: "3%",
				containLabel: true,
			},
			xAxis: {
				type: "category",
				data: data.map((item) => item.day_of_week),
				axisLine: { show: false },
				axisTick: { show: false },
				axisLabel: { color: CHART_COLORS.xAxis.axisLabel.color, margin: 12 },
			},
			yAxis: {
				type: "value",
				axisLine: {
					onZero: true,
					lineStyle: { color: CHART_COLORS.yAxis.axisLine.lineStyle.color },
				},
				splitLine: {
					lineStyle: { color: CHART_COLORS.yAxis.splitLine.lineStyle.color },
				},
				axisLabel: {
					color: CHART_COLORS.yAxis.axisLabel.color,
					formatter: (value) => formatNum(Number(value), { currency: "USD", style: "currency" }),
				},
			},
			series: [{
				type: "line",
				smooth: true,
				symbol: "circle",
				symbolSize: 6,
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
			}],
		};

		return new Chart("line", chartData, getAssignOptions(defaults, customOptions), !data.length);
	}

	// "Количество сделок" - сколько сделок по каждому активу, данные с бэкенда.
	static fromOrdersBySymbol(
		data: TradeByAssetItem[],
		customOptions: Partial<EChartsOption> = {}
	): Chart {
		const chartData: ChartDataPoint[] = data.map((item) => ({
			name: item.asset,
			value: item.count,
		}));

		const defaults: Partial<EChartsOption> = {
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
			}],
		};

		return new Chart("bar", chartData, getAssignOptions(defaults, customOptions), !data.length);
	}

	// "Соотношение Win/Loss" - данные с бэкенда.
	static fromOrdersWinLoss(
		data: Partial<WinLossRatio>,
		customOptions: Partial<EChartsOption> = {}
	): Chart {
		const chartData: ChartDataPoint[] = [
			{ name: "Прибыльные", value: Number(data.profitable_count ?? 0) },
			{ name: "Убыточные", value: Number(data.loss_count ?? 0) },
		];

		const defaults: Partial<EChartsOption> = {
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
					borderRadius: 8,
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

		return new Chart("pie", chartData, getAssignOptions(defaults, customOptions), !Object.values(data).some((v) => isNumber(v) && v > 0));
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
		const top = sorted.slice(0, MAX_TOP_SLICES);
		const restSum = sorted.slice(MAX_TOP_SLICES).reduce((sum, [_, v]) => sum + v, 0);

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

		return new Chart("pie", data, getAssignOptions(defaults, customOptions));
	}
};
