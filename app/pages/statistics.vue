<template>
	<div class="flex flex-col gap-24">
		<LazyOrganismsStatisticsListCards :statistics="statistics?.data" />
		<LazyOrganismsStatisticsListCharts />
	</div>
</template>

<script setup lang="ts">
import { useSummary } from "@/composables/api/useStatistics";

const { suspense, data: statistics } = useSummary();

await suspense();
</script>
