<template>
	<Filters
		:filters="filters"
		filter-classes="gap-16 bg-neutral-200 rounded-8 p-16 border border-solid border-white/10"
		title="Ордера"
	/>
</template>
<script setup lang="ts">
import Filters from "@/components/molecules/common/Filters.vue";
import ACheckbox from "@/components/atoms/ACheckbox.vue";
import ASelect from "@/components/atoms/ASelect.vue";

withDefaults(
	defineProps<{
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

const route = useRoute();

const filtersQuery = defineModel<Record<string, string>>({ default: () => ({}) });

const STATUSES_LIST: SelectItem[] = [
	{ label: "Все", value: "all" },
	{ label: "Закрытые", value: "closed" },
	{ label: "Открытые", value: "open" },
];

const RESULTS_LIST: SelectItem[] = [
	{ label: "Все", value: "all" },
	{ label: "Тейк-профит", value: "take-profit" },
	{ label: "Стоп-лосс", value: "stop-loss" },
];

const createFilters = (): FilterItem[] => [
	{
		name: "type",
		component: markRaw(ASelect),
		label: "Статус",
		value: String(route.query.type ?? STATUSES_LIST[0]?.value ?? ""),
		items: STATUSES_LIST,
		classes: "lg:min-w-250",
	},
	{
		name: "result",
		component: markRaw(ASelect),
		label: "Результат",
		value: String(route.query.result ?? RESULTS_LIST[0]?.value ?? ""),
		items: RESULTS_LIST,
		classes: "lg:min-w-250",
	},
	{
		name: "activeConfig",
		component: markRaw(ACheckbox),
		label: "Только активный конфиг",
		value: Boolean(!route.query.activeConfig ? false : route.query.activeConfig === "true"),
		classes: "text-white",
	},
];

const filters = ref<FilterItem[]>(createFilters());

watch(filters, (v) => {
	filtersQuery.value = getFiltersQuery(v);
}, { immediate: true, deep: true });
</script>
