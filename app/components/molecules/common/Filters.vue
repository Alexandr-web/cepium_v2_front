<template>
	<div class="flex flex-col lg:flex-row gap-40 lg:gap-20 lg:flex-wrap">
		<component
			:is="filter.component"
			v-for="(filter, idx) in filters"
			:key="idx"
			ref="group"
			v-model="filter.value"
			:label="filter.label"
			:items="filter.items"
			:disabled="disabled"
			:class="filter.classes"
		/>
		<slot name="footer" />
	</div>
</template>
<script setup lang="ts">
import type { ButtonGroupExpose } from "@/components/atoms/AButtonGroup.vue";

const props = withDefaults(
	defineProps<{
		disabled?: boolean;
		filters: TFilterItem[];
	}>(),
	{
		disabled: false,
	}
);

export type FiltersExpose = {
	initDefaultValuesAtButtonGroup: () => Promise<void>;
};

const group = ref<Partial<ButtonGroupExpose>[]>([]);

/**
 * Синхронизирует визуальное состояние (бегунок) всех ButtonGroup-фильтров
 * с текущими значениями props.filters - например, после программного
 * сброса фильтров к дефолтам в родителе (см. Orders.vue -> reset()).
 *
 * Индексы group.value и props.filters гарантированно совпадают, т.к. оба
 * массива формируются одним и тем же v-for без фильтрации/сортировки.
 *
 * У элементов, не являющихся ButtonGroup (нет setDefaultValue), вызов
 * просто пропускается через ?.() - без явной проверки типа компонента.
 */
const initDefaultValuesAtButtonGroup = async () => {
	await nextTick();

	const prms = (group.value ?? []).map((instance, idx) => instance.setDefaultValue?.(String(props.filters[idx]?.value)));

	await Promise.all(prms);
};

defineExpose({ initDefaultValuesAtButtonGroup });
</script>
