<template>
	<section class="grid grid-cols-1 lg:grid-cols-4 gap-24 p-12 lg:p-24 bg-neutral-100 min-h-screen rounded-12">
		<div
			v-for="(item, idx) in charts"
			:key="idx"
			class="flex flex-col bg-neutral-200 border border border-neutral-300 rounded-12 p-12 lg:p-20 gap-16"
			:class="item.classes"
		>
			<h3 class="text-16 font-medium text-neutral-700">{{ item.label }}</h3>
			<div class="h-200 lg:h-300 w-full">
				<VChart :option="item.options" class="w-full h-full" />
			</div>
		</div>
	</section>
</template>
<script setup lang="ts">
import Chart from "@/models/Chart";

const profitChart = new Chart(
	"line",
	[
		{ name: "Пн", value: 120 },
		{ name: "Вт", value: -50 },
		{ name: "Ср", value: 340 },
		{ name: "Чт", value: 210 },
		{ name: "Пт", value: 480 },
	],
	{
		tooltip: {
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			trigger: "axis",
			formatter: (params) => {
				const item = Array.isArray(params) ? params[0] : params;
				const n = Number(item?.value);
				const currency = formatNum(n, { currency: "USD", style: "currency" });
				return `${item?.name}: <span class="font-medium ${n > 0 ? "text-tertiary-700" : "text-secondary-500"}">${currency}</span>`;
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
			data: ["Пн", "Вт", "Ср", "Чт", "Пт"],
			type: "category",
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
				lineStyle: {
					color: CHART_COLORS.yAxis.splitLine.lineStyle.color,
				},
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
				formatter: (params) => formatNum(Number(params.value), { currency: "USD", style: "currency" }),
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
						{ offset: 0, color: CHART_COLORS.series.line.areaStyle.color.colorStops[0] },
						{ offset: 1, color: CHART_COLORS.series.line.areaStyle.color.colorStops[1] },
					],
				},
			},
		}],
	}
);

const dealsChart = new Chart(
	"bar",
	[
		{ name: "BTC", value: 12 },
		{ name: "ETH", value: 19 },
		{ name: "SOL", value: 32 },
		{ name: "TON", value: 8 },
	],
	{
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
	}
);

const winrateChart = new Chart(
	"pie",
	[
		{ name: "Прибыльные", value: 652 },
		{ name: "Убыточные", value: 353 },
	],
	{
		color: [
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: CHART_COLORS.color.pie[0].colorStops[0] },
					{ offset: 1, color: CHART_COLORS.color.pie[0].colorStops[1] },
				],
			},
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: CHART_COLORS.color.pie[1].colorStops[0] },
					{ offset: 1, color: CHART_COLORS.color.pie[1].colorStops[1] },
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
				return `${item?.name}: <span class="font-semibold">${item?.value} шт. (${item?.percent}%)</span>`;
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
			avoidLabelOverlap: true,
			center: ["50%", "45%"], 
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
	}
);

const charts = computed(() => [
	{
		label: "Динамика профита",
		chart: profitChart,
		options: profitChart.getComputedOptions(),
		classes: "lg:col-span-4",
	},
	{
		label: "Количество сделок",
		chart: dealsChart,
		options: dealsChart.getComputedOptions(),
		classes: "lg:col-span-3",
	},
	{
		label: "Соотношение Win/Loss",
		chart: winrateChart,
		options: winrateChart.getComputedOptions(),
	},
]);
</script>
