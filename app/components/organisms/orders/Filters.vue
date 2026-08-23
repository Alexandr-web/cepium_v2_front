<template>
	<section class="flex flex-col gap-24">
		<div class="flex items-center justify-between gap-10">
			<h2 class="text-20 lg:text-24 font-semibold">Ордера</h2>
			<AButton
				class="flex lg:hidden items-center justify-center p-12 rounded-8 border border-solid border-neutral-400"
				mode="neutral-fill"
				:disabled="disabled"
				@click="showMobFilters = true"
			>
				<IconFilter class="w-18 h-18 text-white/50" />
			</AButton>
		</div>
		<div class="hidden lg:flex justify-between gap-16 bg-neutral-100 rounded-8 p-16 border border-solid border-white/10">
			<Filters ref="deskFilters" :filters="filters" :disabled="disabled" />
			<FilterControls preset="desk" :disabled="disabled" @execute="emits('execute', query)" @reset="reset" />
		</div>
	</section>
	<Teleport to="body">
		<Modal v-model="showMobFilters">
			<div class="scroll-block max-h-450 overflow-auto">
				<Filters
					ref="mobFilters"
					class="lg:hidden"
					:filters="filters"
				>
					<template #footer>
						<FilterControls preset="mob" :disabled="disabled" @execute="emits('execute', query)" @reset="reset" />
					</template>
				</Filters>
			</div>
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import Filters from "@/components/molecules/common/Filters.vue";
import type { FiltersExpose } from "@/components/molecules/common/Filters.vue";
import AButton from "@/components/atoms/AButton.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import FilterControls from "@/components/molecules/orders/FilterControls.vue";
import IconFilter from "@/assets/icons/filter-alt-outline-sharp.svg";
import AButtonGroup from "@/components/atoms/AButtonGroup.vue";
import ACheckbox from "@/components/atoms/ACheckbox.vue";

withDefaults(
	defineProps<{
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

const emits = defineEmits(["execute"]);

const { isMobile } = useDevice();

const STATUSES_LIST: TSelectItem[] = [
	{ label: "Все", value: "all" },
	{ label: "Закрытые", value: "closed" },
	{ label: "Открытые", value: "open" },
];

const RESULTS_LIST: TSelectItem[] = [
	{ label: "Все", value: "all" },
	{ label: "Тейк-профит", value: "take-profit" },
	{ label: "Стоп-лосс", value: "stop-loss" },
];

const createFilters = (): TFilterItem[] => [
	{
		name: "type",
		component: markRaw(AButtonGroup),
		label: "Статус",
		value: String(STATUSES_LIST[0]?.value ?? ""),
		items: STATUSES_LIST,
	},
	{
		name: "result",
		component: markRaw(AButtonGroup),
		label: "Результат",
		value: String(RESULTS_LIST[0]?.value ?? ""),
		items: RESULTS_LIST,
	},
	{
		name: "activeConfig",
		component: markRaw(ACheckbox),
		label: "Ордера активного конфига",
		value: true,
		classes: "text-white",
	},
];

const filters = ref<TFilterItem[]>(createFilters());
const mobFilters = ref<FiltersExpose|null>(null);
const deskFilters = ref<FiltersExpose|null>(null);
const showMobFilters = ref(false);

const query = computed(() =>
	filters.value.reduce<Record<string, string>>((query, filter) => {
		query[filter.name] = String(filter.value);
		return query;
	}, {})
);

const reset = async () => {
	filters.value = createFilters();
	
	if (isMobile) await mobFilters.value?.initDefaultValuesAtButtonGroup();
	else await deskFilters.value?.initDefaultValuesAtButtonGroup();
};

watch(showMobFilters, async (v) => {
	if (v && isMobile) await mobFilters.value?.initDefaultValuesAtButtonGroup();
	else if (v) await deskFilters.value?.initDefaultValuesAtButtonGroup();
});

watch(() => isMobile, (v) => !v && (showMobFilters.value = false));
</script>
