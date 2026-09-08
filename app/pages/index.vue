<template>
	<div class="flex flex-col gap-16 lg:gap-32">
		<LazyMoleculesWidgetsCoinsMarquee class="-mx-16" />
		<LazyOrganismsIndexSummary />
		<LazyOrganismsIndexErrors />
		<div class="flex flex-col -mx-16 bg-neutral-300/50 p-16">
			<LazyOrganismsIndexActiveTrades />
		</div>
	</div>
</template>
<script setup lang="ts">
import { useUser } from "@/composables/api/useUser";

const { suspense } = useUser();

await suspense();

useHead({
	script: [
		{
			src: "https://widgets.coingecko.com/gecko-coin-price-marquee-widget.js",
			async: true,
		},
		{
			src: "https://widgets.coingecko.com/gecko-coin-price-chart-widget.js",
			async: true,
		},
	],
});
</script>
