<template>
	<section class="grid grid-cols-1 lg:grid-cols-3 gap-12">
		<Card v-for="(card, idx) in cards" :key="idx" :card="card">
			<IconTrendingUp
				v-if="['winrate', 'profit'].includes(card.id)"
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

const cards: TStatisticsCard[] = [
	{
		id: "profit",
		title: "Общий профит",
		value: 10000,
		normalizer: (value) => formatNum(value, { currency: "USD", style: "currency" }),
		icon: "arrows-more-up-rounded",
		classesValue: "text-tertiary-700",
	},
	{
		id: "winrate",
		title: "Винрейт",
		value: -0.212,
		normalizer: (value) => formatNum(value, { style: "percent" }),
		icon: "money-bag-outline-rounded",
		classesValue: "text-secondary-500",
	},
	{
		id: "deals",
		title: "Всего сделок",
		value: 1,
		normalizer: (value) => formatNum(value, { padZero: true }),
		icon: "card-travel-outline-rounded",
	},
];
</script>
