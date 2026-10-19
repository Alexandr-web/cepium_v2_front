<template>
	<div class="flex flex-col gap-24">
		<LazyOrganismsStatisticsListCards
			:profit="profit"
			:winrate="winrate"
			:deals="deals"
		/>
		<LazyOrganismsStatisticsListCharts />
	</div>
</template>

<script setup lang="ts">
import { useMetrics } from "@/composables/api/useMetrics";

const { suspense, data: _metrics } = useMetrics();

await suspense();

const metrics = computed(() => _metrics.value?.data.overall || {});

const profit = computed(() => Number(metrics.value.totalR || 0));
const winrate = computed(() => Number(metrics.value.winRate || 0));
const deals = computed(() => Number(metrics.value.trades || 0));
</script>
