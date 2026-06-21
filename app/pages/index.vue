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
import SummaryNote from "@/components/molecules/index/SummaryNote.vue";

const summary: TIndexCardSummary[] = [
	{
		title: "Баланс",
		icon: "material-symbols:arrows-more-up-rounded",
		value: formatNum(142032, { currency: "USD", style: "currency" }),
		type: "balance",
	},
	{
		title: "Активные позиции",
		icon: "material-symbols:shelf-position-sharp",
		value: formatNum(2, { padZero: true }),
		type: "positions",
	},
	{
		title: "24ч реализованный PNL",
		icon: "material-symbols:money-bag-outline-rounded",
		value: formatNum(232, { currency: "USD", style: "currency" }),
		type: "pnl",
	},
];
</script>
