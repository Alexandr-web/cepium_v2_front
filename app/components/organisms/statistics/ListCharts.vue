<template>
	<section class="grid grid-cols-1 lg:grid-cols-4 gap-24 p-12 lg:p-24 bg-black min-h-screen rounded-12">
		<div
			v-for="(item, idx) in charts"
			:key="idx"
			class="flex flex-col bg-neutral-100/50 border border border-neutral-200 rounded-12 p-12 lg:p-20 gap-16"
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

// тестовые данные
const mockData = {
	profit_dynamics: [
		{ date: "2026-10-19", day_of_week: "Пн", profit_usd: 10.5 },
		{ date: "2026-10-20", day_of_week: "Вт", profit_usd: 115.0 },
		{ date: "2026-10-21", day_of_week: "Ср", profit_usd: 54.5 },
		{ date: "2026-10-22", day_of_week: "Чт", profit_usd: 182.5 },
		{ date: "2026-10-23", day_of_week: "Пт", profit_usd: 0.0 },
		{ date: "2026-10-24", day_of_week: "Сб", profit_usd: 0.0 },
		{ date: "2026-10-25", day_of_week: "Вс", profit_usd: 0.0 },
	],
	trades_by_asset: [
		{ asset: "ETH", count: 3 },
		{ asset: "SOL", count: 3 },
		{ asset: "TON", count: 3 },
		{ asset: "BTC", count: 2 },
	],
	win_loss_ratio: {
		profitable_count: 8,
		loss_count: 3,
	},
};

const charts = computed(() => [
	{
		label: "Динамика профита",
		options: Chart.fromOrdersProfitByDay(mockData.profit_dynamics).getComputedOptions(),
		classes: "lg:col-span-4",
	},
	{
		label: "Количество сделок",
		options: Chart.fromOrdersBySymbol(mockData.trades_by_asset).getComputedOptions(),
		classes: "lg:col-span-3",
	},
	{
		label: "Соотношение Win/Loss",
		options: Chart.fromOrdersWinLoss(mockData.win_loss_ratio).getComputedOptions(),
	},
]);
</script>
