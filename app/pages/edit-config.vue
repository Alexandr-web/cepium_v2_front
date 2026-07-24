<template>
	<div class="flex flex-col">
		<LazyOrganismsConfigsForm
			hydrate-on-visible
			title="Изменение конфига"
			btn-text="Изменить"
			:strategies="strategies"
			:is-pending-exchanges="isPendingExchanges"
			:is-pending-strategy="isPendingStrategy"
			:data="config"
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

// TODO добавить бек

const config = {
	id: "1",
	margin: "isolated",
	allowedSymbols: ["BTC/USDT:USDT", "SOL/USDT:USDT"],
	maxLeverage: 12,
	maxLossPercent: 0.8,
	dailyGoalPercent: 1,
	maxPositionSize: 10,
	demoTrading: true,
	activate: false,
	strategy: {
		id: "ad74ba32-e0b4-4913-bc27-bc02bf977c61",
		name: "Стратегия 1",
		description: "Описание стратегии 1",
		algoSection: {
			indicators: [""],
			shortlistConditions: {},
		},
		timeframe: "1h",
		params: {},
	},
};
</script>
