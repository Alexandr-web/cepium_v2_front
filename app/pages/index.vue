<template>
	<div class="flex flex-col gap-16 lg:gap-32">
		<LazyMoleculesWidgetsCoinsMarquee class="-mx-16" />
		<LazyOrganismsIndexSummary />
		<LazyOrganismsIndexErrors />
		<LazyOrganismsIndexActiveTrades />
	</div>
</template>
<script setup lang="ts">
const { $events } = useNuxtApp();

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

onMounted(() => {
	$events.subscribeAccountInfo();
	$events.subscribeDeals();
});

onUnmounted(() => {
	$events.unsubscribeAccountInfo();
	$events.unsubscribeDeals();
});
</script>
