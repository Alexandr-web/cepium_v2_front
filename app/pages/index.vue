<template>
	<div class="flex flex-col gap-16 lg:gap-32">
		<LazyMoleculesCommonCoinsMarquee class="-mx-16" />
		<LazyOrganismsIndexSummary />
		<LazyOrganismsIndexErrors />
		<div class="flex flex-col -mx-16 bg-neutral-300/50 p-16">
			<LazyOrganismsIndexActiveTrades :trades="tradeStore.trades" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { useTradeStore } from "@/store/useTradeStore";
import { useUser } from "@/composables/api/useUser";

const { suspense } = useUser();

await suspense();

const tradeStore = useTradeStore();

useHead({
	script: [
		{
			src: "https://widgets.coingecko.com/gecko-coin-price-marquee-widget.js",
			defer: true,
		},
		{
			src: "https://widgets.coingecko.com/gecko-coin-price-chart-widget.js",
			defer: true,
		},
	],
});
</script>
