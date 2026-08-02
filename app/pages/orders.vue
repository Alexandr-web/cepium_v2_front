<template>
	<div class="flex flex-col gap-24 grow">
		<LazyOrganismsOrdersFilters :disabled="!orders.length" @execute="console.log('execute filters')" />
		<LazyOrganismsOrdersList :orders="orders" />
	</div>
</template>
<script setup lang="ts">
// моковые данные
const orders: TOrder[] = [];
</script>
