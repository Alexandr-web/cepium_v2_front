<template>
	<section class="grid grid-cols-1 lg:grid-cols-4 gap-24 p-12 lg:p-24 bg-neutral-100 min-h-screen rounded-12">
		<div
			v-for="(item, idx) in charts"
			:key="idx"
			class="flex flex-col bg-neutral-200 border border-1 border-neutral-300 rounded-12 p-12 lg:p-20 gap-16"
			:class="item.classes"
		>
			<h3 class="text-16 font-medium text-neutral-700">{{ item.label }}</h3>
			<div class="h-200 lg:h-300 w-full">
				<VChart :option="item.chart.getComputedOptions()" class="w-full h-full" autofocus />
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
			backgroundColor: "#161b22",
			borderColor: "#30363d",
			borderWidth: 1,
			textStyle: { color: "#c9d1d9" },
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
			axisLabel: { color: "#8b949e", margin: 12 },
		},
		yAxis: {
			type: "value",
			axisLine: {
				onZero: true,
				lineStyle: { color: "rgba(139, 148, 158, 0.15)" },
			},
			splitLine: {
				lineStyle: {
					color: "rgba(139, 148, 158, 0.05)",
				},
			},
			axisLabel: {
				color: "#8b949e",
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
				color: "#8b949e",
				fontSize: 11,
				formatter: (params) => formatNum(Number(params.value), { currency: "USD", style: "currency" }),
			},
			itemStyle: { color: "#58a6ff" },
			lineStyle: { 
				width: 3, 
				color: "#58a6ff",
				shadowBlur: 10, 
				shadowColor: "rgba(88, 166, 255, 0.15)", 
			},
			areaStyle: {
				color: {
					type: "linear",
					x: 0, y: 0, x2: 0, y2: 1,
					colorStops: [
						{ offset: 0, color: "rgba(88, 166, 255, 0.2)" },
						{ offset: 1, color: "rgba(88, 166, 255, 0.0)" },
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
				color: "#8b949e",
				fontSize: 12,
			},
			itemStyle: { 
				color: "rgba(31,111,235,0.2)",
				borderColor: "#114ba8",
				borderRadius: [6, 6, 0, 0],
			},
		}],
	}
);

const winrateChart = new Chart(
	"pie",
	[
		{ name: "Прибыльные", value: 65 },
		{ name: "Убыточные", value: 35 },
	],
	{
		color: [
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: "#34d399" },
					{ offset: 1, color: "#16a34a" },
				],
			},
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: "#f87171" },
					{ offset: 1, color: "#dc2626" },
				],
			},
		],
		legend: {
			show: true,
			bottom: 0,
			icon: "circle",
			itemWidth: 10,
			itemGap: 20,
			textStyle: {
				color: "#8b949e",
				fontSize: 13,
				fontFamily: "sans-serif",
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
				borderColor: "#0d1117",
				borderWidth: 3,
			},
			emphasis: {
				scale: true,
				scaleSize: 6,
				itemStyle: {
					shadowBlur: 15,
					shadowColor: "rgba(0, 0, 0, 0.5)",
				},
			},
		}],
	}
);

const charts = [
	{
		label: "Динамика профита",
		chart: profitChart,
		classes: "lg:col-span-4",
	},
	{
		label: "Количество сделок",
		chart: dealsChart,
		classes: "lg:col-span-3",
	},
	{
		label: "Соотношение Win/Loss",
		chart: winrateChart,
	},
];
</script>
