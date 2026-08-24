<template>
	<div class="flex flex-col gap-24 grow">
		<LazyOrganismsOrdersFilters @execute="setQuery" @reset="setQuery" />
		<LazyOrganismsOrdersList :filters="filters" />
	</div>
</template>
<script setup lang="ts">
const filters = ref<Record<string, string>>({});

const setQuery = (query = {}) => filters.value = query;
</script>
