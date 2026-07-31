<template>
	<section class="grid grid-cols-1 lg:grid-cols-2 gap-24 p-24 bg-neutral-100 min-h-screen rounded-12">
		<div class="lg:col-span-2 flex flex-col bg-neutral-200 border border-1 border-neutral-300 rounded-12 p-20 gap-16">
			<h3 class="text-16 font-medium text-neutral-700">Динамика профита</h3>
			<div class="h-300 w-full">
				<VChart :option="profitChart.getComputedOptions()" class="w-full h-full" autofocus />
			</div>
		</div>

		<div class="flex flex-col bg-neutral-200 border border-1 border-neutral-300 rounded-12 p-20 gap-16">
			<h3 class="text-16 font-medium text-neutral-700">Количество сделок</h3>
			<div class="h-300 w-full">
				<VChart :option="dealsChart.getComputedOptions()" class="w-full h-full" autofocus />
			</div>
		</div>

		<div class="flex flex-col bg-neutral-200 border border-1 border-neutral-300 rounded-12 p-20 gap-16">
			<h3 class="text-16 font-medium text-neutral-700">Соотношение Win/Loss</h3>
			<div class="h-300 w-full">
				<VChart :option="winrateChart.getComputedOptions()" class="w-full h-full" autofocus />
			</div>
		</div>
	</section>
</template>
<script setup lang="ts">
import Chart from "@/models/Chart";

const profitChart = ref(
	new Chart(
		"line",
		[
			{ name: "Пн", value: 120 },
			{ name: "Вт", value: -50 },
			{ name: "Ср", value: 340 },
			{ name: "Чт", value: 210 },
			{ name: "Пт", value: 480 },
		],
		{
			series: [{
				type: "line",
				smooth: true,
				symbol: "circle",
				symbolSize: 6,
				itemStyle: { color: "#58a6ff" }, // Яркий синий GitHub
				lineStyle: { width: 3, shadowBlur: 10, shadowColor: "rgba(88, 166, 255, 0.3)" },
				// Добавляем прозрачный градиент снизу
				areaStyle: {
					color: {
						type: "linear",
						x: 0, y: 0, x2: 0, y2: 1,
						colorStops: [
							{ offset: 0, color: "rgba(88, 166, 255, 0.25)" }, // Сверху посветлее
							{ offset: 1, color: "rgba(88, 166, 255, 0.00)" },  // Снизу в полный ноль
						],
					},
				},
			}],
		}
	)
);

const dealsChart = ref(
	new Chart(
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
				barWidth: "40%", // Делаем столбцы чуть аккуратнее по ширине
				itemStyle: { 
					color: "#388bfd",
					// Красивое скругление только верхних углов у столбцов
					borderRadius: [6, 6, 0, 0],
				},
			}],
		}
	)
);

const winrateChart = ref(
	new Chart(
		"pie",
		[
			{ name: "Прибыльные", value: 65 },
			{ name: "Убыточные", value: 35 },
		],
		{
			// Задаем явную палитру для секторов (Зеленый третичный и Красный вторичный из ваших стилей)
			color: ["#2ea043", "#f85149"], 
			series: [{
				type: "pie",
				radius: ["55%", "75%"], // Сделали кольцо чуть тоньше и изящнее
				avoidLabelOverlap: false,
				label: {
					show: true,
					position: "outside",
					color: "#8b949e",
					formatter: "{b}: {c}%",
				},
				itemStyle: {
					borderRadius: 4,
					borderColor: "#0d1117", // Темная обводка-разделитель между секторами
					borderWidth: 2,
				},
			}],
		}
	)
);
</script>
