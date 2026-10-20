<template>
	<div class="flex flex-col gap-24">
		<LazyOrganismsStatisticsListCards :statistics="statistics?.data" />
		<LazyOrganismsStatisticsListCharts :strategies="strategies?.data" />
	</div>
</template>

<script setup lang="ts">
import { useSummary } from "@/composables/api/useStatistics";
import { useStrategy } from "@/composables/api/useStrategies";

const { suspense: suspenseStrategies, data: strategies } = useStrategy();
const { suspense: suspenseStatistics, data: statistics } = useSummary();

await Promise.all([suspenseStatistics(), suspenseStrategies()]);
</script>
