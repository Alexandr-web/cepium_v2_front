<template>
	<div class="flex flex-col">
		<gecko-coin-price-chart-widget
			locale="ru"
			dark-mode="true"
			:coin-id="symbol"
			initial-currency="usd"
		/>
	</div>
</template>
<script setup lang="ts">
defineProps<{ symbol: string; }>();
</script>
