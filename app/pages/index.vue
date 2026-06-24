<template>
	<div class="flex flex-col gap-16 lg:gap-32">
		<LazyOrganismsIndexSummary hydrate-on-visible :summary="summary">
			<template #note="card">
				<SummaryNote :card="card" />
			</template>
		</LazyOrganismsIndexSummary>
		<LazyOrganismsIndexActiveTrades hydrate-on-visible :trades="trades" />
	</div>
</template>
<script setup lang="ts">
import type { TIndexCardSummary } from "@/types/components";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useTradeStore } from "@/store/useTradeStore";
import SummaryNote from "@/components/molecules/index/SummaryNote.vue";

const dashboardStore = useDashboardStore();
const tradeStore = useTradeStore();

const trades = computed(() => tradeStore.getAllTrades());

const summary = computed<TIndexCardSummary[]>(() => [
	{
		title: "Баланс",
		icon: "material-symbols:arrows-more-up-rounded",
		value: formatNum(dashboardStore.data.balance, { currency: "USD", style: "currency" }),
		type: "balance",
	},
	{
		title: "Активные позиции",
		icon: "material-symbols:shelf-position-sharp",
		value: formatNum(dashboardStore.data.activePositionsCount, { padZero: true }),
		type: "positions",
	},
	{
		title: "24ч реализованный PNL",
		icon: "material-symbols:money-bag-outline-rounded",
		value: formatNum(dashboardStore.data.pnl24h, { currency: "USD", style: "currency" }),
		type: "pnl",
	},
]);
</script>
