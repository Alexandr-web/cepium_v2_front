<template>
	<div class="flex flex-col gap-16 lg:gap-32">
		<OrganismsIndexSummary :summary="summary">
			<template #note="card">
				<SummaryNote :card="card" />
			</template>
		</OrganismsIndexSummary>
		<div class="-mx-16 bg-neutral-300/50 p-16">
			<div class="flex flex-col gap-16 lg:gap-32">
				<OrganismsIndexActiveTrades :trades="trades" />
				<OrganismsIndexPopularCoins :coins="coins" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useDashboardStore } from "@/store/useDashboardStore";
import { useTradeStore } from "@/store/useTradeStore";
import { useCoinsStore } from "@/store/useCoinsStore";
import SummaryNote from "@/components/molecules/index/SummaryNote.vue";
import { useUser } from "@/composables/api/useUser";

const { suspense } = useUser();

await suspense();

const dashboardStore = useDashboardStore();
const tradeStore = useTradeStore();
const coinsStore = useCoinsStore();

const trades = computed(() => tradeStore.getAllTrades());
const coins = computed(() => coinsStore.getAllCoins());

const summary = computed<TIndexCardSummary[]>(() => [
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
		title: "24ч реализованный PNL",
		icon: "money-bag-outline-rounded",
		value: dashboardStore.data.pnl24h,
		formattedValue: formatNum(dashboardStore.data.pnl24h, { currency: "USD", style: "currency" }),
		type: "pnl",
	},
]);
</script>
