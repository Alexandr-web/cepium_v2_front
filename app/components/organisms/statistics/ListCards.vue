<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
		<Card v-for="(card, idx) in cards" :key="idx" :card="card">
			<template #value>
				<p
					:class="[
						['winrate', 'profit'].includes(card.id) && Number(card.value) > 0 && 'text-tertiary-500',
						['winrate', 'profit'].includes(card.id) && Number(card.value) < 0 && 'text-secondary-500',
						!['winrate', 'profit'].includes(card.id) && 'text-neutral-950'
					]"
				>
					<template v-if="card.id === 'profit'">
						{{ formatNum(card.value, { currency: "USD", style: "currency" }) }}
					</template>
					
					<template v-else-if="card.id === 'winrate'">
						{{ formatNum(card.value, { style: "percent" }) }}
					</template>
					
					<template v-else-if="card.id === 'trades'">
						{{ formatNum(card.value, { padZero: true }) }}
					</template>
					
					<template v-else>
						{{ card.value }}
					</template>

					<IconTrendingUp
						v-if="['winrate', 'profit'].includes(card.id)"
						class="w-32 h-32 absolute bottom-10 right-20"
						:class="[
							Number(card.value) > 0 && 'text-tertiary-400',
							Number(card.value) < 0 && 'text-secondary-400 rotate-x-180'
						]"
					/>
				</p>
			</template>
		</Card>
	</div>
</template>
<script setup lang="ts">
import IconTrendingUp from "@/assets/icons/material-symbols-trending-up.svg";
import Card from "@/components/molecules/statistics/Card.vue";

const cards: TStatisticsCard[] = [
	{
		id: "profit",
		title: "Общий профит",
		value: 2.032,
		icon: "arrows-more-up-rounded",
	},
	{
		id: "winrate",
		title: "Винрейт",
		value: -0.212,
		icon: "money-bag-outline-rounded",
	},
	{
		id: "deals",
		title: "Всего сделок",
		value: 39,
		icon: "card-travel-outline-rounded",
	},
];
</script>
