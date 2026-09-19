<template>
	<div class="flex flex-col gap-24">
		<div class="flex items-center justify-between gap-10">
			<h2 class="text-20 lg:text-24 font-semibold">Ордера</h2>
			<AButton
				class="flex lg:hidden items-center justify-center p-8 rounded-8 border border-solid border-neutral-400"
				:mode="ButtonMode.NEUTRAL_FILL"
				:disabled="disabled"
				@click="showMobFilters = true"
			>
				<IconFilter class="w-22 h-22 text-white/50" />
			</AButton>
		</div>
		<div class="hidden lg:flex justify-between gap-16 bg-neutral-100 rounded-8 p-16 border border-solid border-white/10">
			<Filters :filters="filters" :disabled="disabled" />
		</div>
	</div>
	<Teleport to="body">
		<Modal v-model="showMobFilters">
			<div class="scroll-block max-h-450 overflow-auto">
				<Filters
					class="lg:hidden"
					:filters="filters"
				/>
			</div>
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import Filters from "@/components/molecules/common/Filters.vue";
import AButton from "@/components/atoms/AButton.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import IconFilter from "@/assets/icons/filter-big.svg";
import ACheckbox from "@/components/atoms/ACheckbox.vue";
import ASelect from "~/components/atoms/ASelect.vue";

withDefaults(
	defineProps<{
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

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
		value: String(STATUSES_LIST[0]?.value ?? ""),
		items: STATUSES_LIST,
		classes: "lg:min-w-250",
	},
	{
		name: "result",
		component: markRaw(ASelect),
		label: "Результат",
		value: String(RESULTS_LIST[0]?.value ?? ""),
		items: RESULTS_LIST,
		classes: "lg:min-w-250",
	},
	{
		name: "activeConfig",
		component: markRaw(ACheckbox),
		label: "Только активный конфиг",
		value: false,
		classes: "text-white",
	},
];

const filters = ref<FilterItem[]>(createFilters());
const showMobFilters = ref(false);

watch(filters, (v) => {
	filtersQuery.value = v.reduce<Record<string, string>>((query, filter) => {
		query[filter.name] = String(filter.value);
		return query;
	}, {});
}, { immediate: true, deep: true });
</script>
