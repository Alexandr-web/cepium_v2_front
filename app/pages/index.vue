<template>
	<div class="flex flex-col gap-16">
		<LazyOrganismsIndexSummary hydrate-on-visible :summary="summary">
			<template #note="card">
				<SummaryNote :card="card" />
			</template>
		</LazyOrganismsIndexSummary>
	</div>
</template>
<script setup lang="ts">
import type { TIndexCardSummary } from "@/types/components";
import { useDashboardStore } from "@/store/useDashboardStore";
import SummaryNote from "@/components/molecules/index/SummaryNote.vue";

const dashboardStore = useDashboardStore();

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
