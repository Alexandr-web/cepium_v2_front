<template>
	<section class="grid grid-cols-1 lg:grid-cols-3 gap-12">
		<Card v-for="(card, idx) in cards" :key="idx" :card="card">
			<IconTrendingUp
				v-if="['winrate', 'profit'].includes(card.id) && card.value !== 0"
				class="w-32 h-32 absolute bottom-10 right-20"
				:class="[
					Number(card.value) > 0 && 'text-tertiary-400',
					Number(card.value) < 0 && 'text-secondary-400 rotate-x-180'
				]"
			/>
		</Card>
	</section>
</template>
<script setup lang="ts">
import IconTrendingUp from "@/assets/icons/material-symbols-trending-up.svg";
import Card from "@/components/molecules/statistics/Card.vue";

const props = withDefaults(
	defineProps<{
		statistics?: StatisticsResponse["data"];
	}>(),
	{
		statistics: undefined,
	}
);

const profit = computed(() => Number(props.statistics?.totalProfit || 0));
const winrate = computed(() => Number(props.statistics?.winRate || 0));
const deals = computed(() => Number(props.statistics?.totalTrades || 0));

const cards = computed<StatisticsCard[]>(() => [
	{
		id: "profit",
		title: "Общий профит",
		value: profit.value,
		normalizer: (value) => formatNum(value, { currency: "USD", style: "currency" }),
		icon: "arrows-more-up-rounded",
		classesValue: [
			profit.value > 0 ? "text-tertiary-700" : "",
			profit.value < 0 ? "text-secondary-500" : "",
		],
	},
	{
		id: "winrate",
		title: "Винрейт",
		value: winrate.value,
		normalizer: (value) => formatNum(Number(value) / 100, { style: "percent" }),
		icon: "money-bag-outline-rounded",
		classesValue: [
			winrate.value >= 50 ? "text-tertiary-700" : "",
			winrate.value < 50 ? "text-secondary-500" : "",
		],
	},
	{
		id: "deals",
		title: "Всего сделок",
		value: deals.value,
		normalizer: (value) => formatNum(value, { padZero: true }),
		icon: "card-travel-outline-rounded",
	},
]);
</script>
