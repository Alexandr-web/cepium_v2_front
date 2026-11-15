<template>
	<div class="flex flex-col lg:flex-row gap-20 lg:flex-wrap">
		<component
			:is="filter.component"
			v-for="(filter, idx) in filters"
			:key="idx"
			v-model="filter.value"
			:label="filter.label"
			:items="filter.items"
			:disabled="disabled"
			:class="filter.classes"
			label-classes="lg:text-16"
		/>
		<slot name="footer" />
	</div>
</template>
<script setup lang="ts">
withDefaults(
	defineProps<{
		disabled?: boolean;
		filters: FilterItem[];
	}>(),
	{
		disabled: false,
	}
);
</script>
