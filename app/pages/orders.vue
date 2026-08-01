<template>
	<div class="flex flex-col gap-24 grow">
		<OrganismsOrdersFilters @execute="console.log('execute filters')" />
		<OrganismsOrdersList :orders="orders" />
	</div>
</template>
<script setup lang="ts">
// моковые данные
const orders: TOrder[] = [
	{
		symbol: "BTCUSDT",
		direction: "BUY",
		amount: 0.05,
		time: "2026-07-28T15:30:00Z",
		enterPrice: 65250.50,
		type: "MARKET",
		position: "LONG",
		status: "open",
	},
	{
		symbol: "ETHUSDT",
		direction: "SELL",
		amount: 1.25,
		time: "2026-07-28T16:15:22Z",
		enterPrice: 3450.75,
		type: "MARKET",
		position: "SHORT",
		status: "open",
	},
	{
		symbol: "SOLUSDT",
		direction: "BUY",
		amount: 15.0,
		time: "2026-07-28T17:02:10Z",
		enterPrice: 182.40,
		type: "MARKET",
		position: "LONG",
		status: "close",
		pnl: 23.12,
	},
	{
		symbol: "XRPUSDT",
		direction: "SELL",
		amount: 500.0,
		time: "2026-07-28T18:45:00Z",
		enterPrice: 0.595,
		type: "LIMIT",
		position: "SHORT",
		status: "open",
	},
	{
		symbol: "BNBUSDT",
		direction: "BUY",
		amount: 2.5,
		time: "2026-07-28T19:10:05Z",
		enterPrice: 575.20,
		type: "LIMIT",
		position: "LONG",
		status: "close",
		pnl: -321.02,
	},
];
</script>
