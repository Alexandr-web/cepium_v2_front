import type { EChartsOption } from "echarts";

export type TChartType = "line" | "bar" | "pie" | "scatter";

export type TChartDataPoint = {
	name: string | number;
	value: number;
	[key: string]: unknown;
};

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
};
