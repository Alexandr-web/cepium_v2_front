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
				backgroundColor: "#161b22",
				borderColor: "#30363d",
				borderWidth: 1,
				textStyle: { color: "#c9d1d9" },
			},
			series: [],
		};

		if (this.type !== "pie") {
			Object.assign(baseOptions, {
				yAxis: {
					type: "value",
					splitLine: {
						lineStyle: {
							color: "#21262d", 
							width: 1,
						},
					},
					axisLabel: {
						color: "#8b949e",
						fontSize: 11,
					},
				},
				xAxis: {
					type: "category",
					data: xAxisData,
					axisLine: {
						lineStyle: { color: "#30363d" },
					},
					axisTick: { show: false },
					axisLabel: {
						color: "#8b949e",
						fontSize: 11,
					},
				},
				tooltip: {
					trigger: "axis",
					backgroundColor: "#161b22",
					borderColor: "#30363d",
					borderWidth: 1,
					textStyle: { color: "#c9d1d9" },
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
					backgroundColor: "#161b22",
					borderColor: "#30363d",
					borderWidth: 1,
					textStyle: { color: "#c9d1d9" },
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
