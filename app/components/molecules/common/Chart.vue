<template>
	<ClientOnly>
		<div id="trading-view-chart" class="w-full h-400"/>
	</ClientOnly>
</template>
<script setup lang="ts">
import { useBybitKlines } from "@/composables/api/useBybitKlines";
import { useTradingViewChart } from "@/composables/chart/useTradingViewChart";

const props = withDefaults(
	defineProps<{ symbol?: string; interval: string; }>(),
	{
		symbol: undefined,
	}
);

const { fetchKlines } = useBybitKlines();
const { build, reset } = useTradingViewChart({
	containerSelector: "trading-view-chart",
	interval: props.interval,
});

watch(
	() => props.symbol,
	async (symbol) => {
		if (!symbol) {
			reset();
			return;
		}

		const data = await fetchKlines({ symbol, interval: props.interval });
		await build(data, symbol);
	},
	{ immediate: true }
);

onUnmounted(reset);
</script>
