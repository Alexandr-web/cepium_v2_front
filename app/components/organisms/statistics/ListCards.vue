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

const props = defineProps<{
	profit: number;
	winrate: number;
	deals: number;
}>();

const cards = computed<StatisticsCard[]>(() => [
	{
		id: "profit",
		title: "Общий профит",
		value: props.profit,
		normalizer: (value) => formatNum(value, { currency: "USD", style: "currency" }),
		icon: "arrows-more-up-rounded",
		classesValue: [
			props.profit > 0 ? "text-tertiary-700" : "",
			props.profit < 0 ? "text-secondary-500" : "",
		],
	},
	{
		id: "winrate",
		title: "Винрейт",
		value: props.winrate,
		normalizer: (value) => formatNum(value, { style: "percent" }),
		icon: "money-bag-outline-rounded",
		classesValue: [
			props.winrate > 0 ? "text-tertiary-700" : "",
			props.winrate < 0 ? "text-secondary-500" : "",
		],
	},
	{
		id: "deals",
		title: "Всего сделок",
		value: props.deals,
		normalizer: (value) => formatNum(value, { padZero: true }),
		icon: "card-travel-outline-rounded",
	},
]);
</script>
