<template>
	<section class="grid grid-cols-1 lg:grid-cols-3 gap-12">
		<Card v-for="card in summary" :key="card.type" :card="card" data-allow-mismatch="" />
	</section>
</template>
<script setup lang="ts">
import Card from "@/components/molecules/index/SummaryCard.vue";
import { useDashboardStore } from "@/store/useDashboardStore";

const { $events } = useNuxtApp();

const dashboardStore = useDashboardStore();

const summary = computed<IndexCardSummary[]>(() => [
	{
		title: "Баланс",
		icon: "arrows-more-up-rounded",
		value: dashboardStore.data.balance,
		formattedValue: formatNum(dashboardStore.data.balance, { currency: "USD", style: "currency" }),
		type: "balance",
	},
	{
		title: "Активные позиции",
		icon: "shelf-position-sharp",
		value: dashboardStore.data.activePositionsCount,
		formattedValue: formatNum(dashboardStore.data.activePositionsCount, { padZero: true }),
		type: "positions",
	},
	{
		title: "24Ч PNL",
		icon: "money-bag-outline-rounded",
		value: dashboardStore.data.pnl24h,
		formattedValue: formatNum(dashboardStore.data.pnl24h, { currency: "USD", style: "currency" }),
		type: "pnl",
	},
]);

onMounted(() => $events.subscribeAccountInfo());
onUnmounted(() => $events.unsubscribeAccountInfo());
</script>
