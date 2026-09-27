<template>
	<div class="flex flex-col">
		<gecko-coin-price-chart-widget
			locale="ru"
			dark-mode="true"
			:coin-id="symbol"
			initial-currency="usd"
			transparent-background="true"
		/>
	</div>
</template>
<script setup lang="ts">
defineProps<{ symbol: string; }>();
</script>
