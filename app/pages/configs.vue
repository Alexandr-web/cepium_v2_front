<template>
	<div class="flex flex-col gap-24 grow">
		<OrganismsConfigsList :configs="configs" />
	</div>
</template>
<script setup lang="ts">
// моковые данные
const configs: TConfigResponse[] = [
	{
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
			id: "1",
			name: "Стратегия 1",
			description: "Описание стратегии 1",
			algoSection: {
				indicators: [""],
				shortlistConditions: {},
			},
			timeframe: "1h",
			params: {},
		},
	},
	{
		id: "2",
		margin: "cross",
		allowedSymbols: ["TON/USDT:USDT", "SOL/USDT:USDT"],
		maxLeverage: 1,
		maxLossPercent: 0.3,
		dailyGoalPercent: 0.7,
		maxPositionSize: 4,
		demoTrading: false,
		activate: false,
		strategy: {
			id: "2",
			name: "Стратегия 2",
			description: "Описание стратегии 2",
			algoSection: {
				indicators: [""],
				shortlistConditions: {},
			},
			timeframe: "4h",
			params: {},
		},
	},
	{
		id: "3",
		margin: "isolated",
		allowedSymbols: ["SOL/USDT:USDT"],
		maxLeverage: 12,
		maxLossPercent: 0.025,
		dailyGoalPercent: 0.23,
		maxPositionSize: 1,
		demoTrading: true,
		activate: true,
		strategy: {
			id: "3",
			name: "Стратегия 3",
			description: "Описание стратегии 3",
			algoSection: {
				indicators: [""],
				shortlistConditions: {},
			},
			timeframe: "10m",
			params: {},
		},
	},
];
</script>
