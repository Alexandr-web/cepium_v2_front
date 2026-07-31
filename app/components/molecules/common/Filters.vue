<template>
	<div class="flex flex-col lg:flex-row gap-40 lg:gap-20 lg:flex-wrap">
		<component
			:is="filter.component"
			v-for="(filter, idx) in filters"
			:key="idx"
			:ref="filter.component.name === 'ButtonGroup' ? 'group' : undefined"
			v-model="filter.value"
			:label="filter.label"
			:items="filter.items"
		/>
		<slot name="footer" />
	</div>
</template>
<script setup lang="ts">
import type { ButtonGroupExpose } from "@/components/atoms/AButtonGroup.vue";

defineProps<{
	filters: TFilterItem[];
}>();

export type FiltersExpose = {
	initDefaultValuesAtButtonGroup: () => Promise<void>;
};

const group = ref<ButtonGroupExpose[]|null>(null);

const initDefaultValuesAtButtonGroup = async () => {
	await nextTick();

	const prms = (group.value ?? []).map((i) => i.setDefaultValue());

	await Promise.all(prms);
};

defineExpose({ initDefaultValuesAtButtonGroup });
</script>
