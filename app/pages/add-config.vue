<template>
	<div class="flex flex-col">
		<LazyOrganismsConfigsAddForm
			:strategies="strategies"
			:is-pending-exchanges="isPendingExchanges"
			:is-pending-strategy="isPendingStrategy"
		/>
	</div>
</template>
<script setup lang="ts">
import { useStrategy } from "@/composables/api/useStrategies";
import { useExchanges } from "@/composables/api/useExchanges";

const { data: strategiesData, suspense: suspenseStrategy, isPending: isPendingStrategy } = useStrategy();
const { suspense: suspenseExchanges, isPending: isPendingExchanges } = useExchanges();

await Promise.all([suspenseStrategy(), suspenseExchanges()]);

const strategies = computed(() => strategiesData.value?.data ?? []);
</script>
