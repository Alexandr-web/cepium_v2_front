<template>
	<div class="flex flex-col gap-24 grow">
		<LazyOrganismsOrdersFilters @execute="(query = {}) => filters = query" />
		<LazyOrganismsOrdersList :filters="filters" />
	</div>
</template>
<script setup lang="ts">
const filters = ref<Record<string, string>>({});
</script>
