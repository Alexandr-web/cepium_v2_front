<template>
	<section class="grid grid-cols-1 lg:grid-cols-4 gap-24 p-12 lg:p-24 bg-neutral-100 min-h-screen rounded-12">
		<div
			v-for="(item, idx) in charts"
			:key="idx"
			class="flex flex-col bg-neutral-200 border border border-neutral-300 rounded-12 p-12 lg:p-20 gap-16"
			:class="item.classes"
		>
			<h3 class="font-medium text-neutral-700">{{ item.label }}</h3>
			<div class="h-200 lg:h-300 w-full">
				<VChart :option="item.options" class="w-full h-full" />
			</div>
		</div>
	</section>
</template>
<script setup lang="ts">
import Chart from "@/models/Chart";

const mockOrders: Order[] = [
	{
		id: "order-1",
		symbol: "BTC",
		side: TradeDirection.LONG,
		size: 0.05,
		entryPrice: 61200,
		leverage: 10,
		createdAt: "2026-08-24T09:12:00.000Z",
		closedAt: "2026-08-24T14:30:00.000Z",
		exitPrice: 62850,
		realizedPnl: 82.5,
		pnlPercent: 27.0,
	},
	{
		id: "order-2",
		symbol: "ETH",
		side: TradeDirection.SHORT,
		size: 1.2,
		entryPrice: 3400,
		leverage: 5,
		createdAt: "2026-08-24T10:05:00.000Z",
		closedAt: "2026-08-24T18:40:00.000Z",
		exitPrice: 3520,
		realizedPnl: -72.0,
		pnlPercent: -17.6,
	},
	{
		id: "order-3",
		symbol: "SOL",
		side: TradeDirection.LONG,
		size: 20,
		entryPrice: 148,
		leverage: 20,
		createdAt: "2026-08-25T08:00:00.000Z",
		closedAt: "2026-08-25T12:15:00.000Z",
		exitPrice: 156,
		realizedPnl: 160.0,
		pnlPercent: 108.1,
	},
	{
		id: "order-4",
		symbol: "TON",
		side: TradeDirection.LONG,
		size: 300,
		entryPrice: 5.6,
		leverage: 2,
		createdAt: "2026-08-25T13:20:00.000Z",
		closedAt: "2026-08-25T19:50:00.000Z",
		exitPrice: 5.45,
		realizedPnl: -45.0,
		pnlPercent: -5.4,
	},
	{
		id: "order-5",
		symbol: "BTC",
		side: TradeDirection.SHORT,
		size: 0.03,
		entryPrice: 63000,
		leverage: 15,
		createdAt: "2026-08-26T07:40:00.000Z",
		closedAt: "2026-08-26T11:00:00.000Z",
		exitPrice: 61800,
		realizedPnl: 54.0,
		pnlPercent: 28.6,
	},
	{
		id: "order-6",
		symbol: "ETH",
		side: TradeDirection.LONG,
		size: 0.8,
		entryPrice: 3350,
		leverage: 10,
		createdAt: "2026-08-26T15:10:00.000Z",
		closedAt: "2026-08-26T21:30:00.000Z",
		exitPrice: 3410,
		realizedPnl: 48.0,
		pnlPercent: 17.9,
	},
	{
		id: "order-7",
		symbol: "SOL",
		side: TradeDirection.SHORT,
		size: 15,
		entryPrice: 152,
		leverage: 10,
		createdAt: "2026-08-27T06:25:00.000Z",
		closedAt: "2026-08-27T09:45:00.000Z",
		exitPrice: 155,
		realizedPnl: -45.0,
		pnlPercent: -19.7,
	},
	{
		id: "order-8",
		symbol: "TON",
		side: TradeDirection.LONG,
		size: 500,
		entryPrice: 5.5,
		leverage: 3,
		createdAt: "2026-08-27T08:00:00.000Z",
		closedAt: "2026-08-27T10:30:00.000Z",
		exitPrice: 5.62,
		realizedPnl: 180.0,
		pnlPercent: 6.5,
	},
	{
		id: "order-10",
		symbol: "ETH",
		side: TradeDirection.SHORT,
		size: 0.6,
		entryPrice: 3480,
		leverage: 8,
		createdAt: "2026-08-27T10:45:00.000Z",
		markPrice: 3510,
		unrealizedPnl: -14.4,
		pnlPercent: -6.9,
		liquidationPrice: 3915,
		takeProfitPrice: 3200,
		stopLossPrice: 3650,
	},
	{
		id: "order-11",
		symbol: "SOL",
		side: TradeDirection.LONG,
		size: 10,
		entryPrice: 150,
		leverage: 10,
		createdAt: "2026-08-27T11:00:00.000Z",
		markPrice: 153,
		unrealizedPnl: 30.0,
		pnlPercent: 20.0,
		liquidationPrice: 135,
		takeProfitPrice: 170,
		stopLossPrice: 142,
	},
	{
		id: "order-12",
		symbol: "TON",
		side: TradeDirection.SHORT,
		size: 200,
		entryPrice: 5.7,
		leverage: 4,
		createdAt: "2026-08-27T11:30:00.000Z",
		markPrice: 5.6,
		unrealizedPnl: 8.0,
		pnlPercent: 7.0,
		liquidationPrice: 6.4,
		takeProfitPrice: 5.3,
		stopLossPrice: 5.95,
	},
];

const profitChart = Chart.fromOrdersProfitByDay(mockOrders, {
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
					{ offset: 0, color: CHART_COLORS.series.line.areaStyle.color.colorStops[0] ?? "transparent" },
					{ offset: 1, color: CHART_COLORS.series.line.areaStyle.color.colorStops[1] ?? "transparent" },
				],
			},
		},
	}],
});

const dealsChart = Chart.fromOrdersBySymbol(mockOrders, {
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
});

const winrateChart = Chart.fromOrdersWinLoss(mockOrders, {
	color: [
		{
			type: "linear",
			x: 0, y: 0, x2: 0, y2: 1,
			colorStops: [
				{ offset: 0, color: CHART_COLORS.color.pie[0]?.colorStops[0] ?? "" },
				{ offset: 1, color: CHART_COLORS.color.pie[0]?.colorStops[1] ?? "" },
			],
		},
		{
			type: "linear",
			x: 0, y: 0, x2: 0, y2: 1,
			colorStops: [
				{ offset: 0, color: CHART_COLORS.color.pie[1]?.colorStops[0] ?? "" },
				{ offset: 1, color: CHART_COLORS.color.pie[1]?.colorStops[1] ?? "" },
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
});

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
