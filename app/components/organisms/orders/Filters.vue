<template>
	<section class="flex flex-col gap-24">
		<div class="flex items-center justify-between gap-10">
			<h2 class="text-20 lg:text-24 font-semibold">Ордера</h2>
			<AButton
				class="flex lg:hidden items-center justify-center p-12 rounded-8 border-1 border-solid border-neutral-400"
				mode="neutral-fill"
				@click="showMobFilters = true"
			>
				<IconFilter class="w-18 h-18 text-white/50" />
			</AButton>
		</div>
		<div class="hidden lg:flex justify-between gap-16 bg-neutral-100 rounded-8 p-16 border-1 border-solid border-white/10">
			<Filters ref="deskFilters" :filters="filters" />
			<div class="flex flex-col gap-5">
				<AButton class="w-full py-8 px-24 rounded-8 text-14" mode="primary-border">Применить</AButton>
				<AButton class="rounded-8 py-8 px-24 w-full text-14" mode="neutral-fill" @click="reset">Очистить</AButton>
			</div>
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
						<div class="flex flex-col gap-20">
							<AButton class="w-full text-14 p-14 rounded-8" mode="primary-border" @click="emits('execute', filters)">Применить</AButton>
							<AButton class="text-neutral-600 text-12" @click="reset">Очистить</AButton>
						</div>
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
import IconFilter from "@/assets/icons/filter-alt-outline-sharp.svg";
import AButtonGroup from "@/components/atoms/AButtonGroup.vue";

const emits = defineEmits(["execute"]);

const { isMobile } = useDevice();

const DIRECTIONS_LIST: TSelectItem[] = [
	{ label: "Все", value: "all" },
	{ label: "Short", value: "short" },
	{ label: "Long", value: "long" },
];

const STATUSES_LIST: TSelectItem[] = [
	{ label: "Все", value: "all" },
	{ label: "Закрытые", value: "close" },
	{ label: "Открытые", value: "open" },
];

const RESULTS_LIST: TSelectItem[] = [
	{ label: "Все", value: "all" },
	{ label: "Тейк-профит", value: "take" },
	{ label: "Стоп-лосс", value: "stop" },
];

const createFilters = (): TFilterItem[] => [
	{
		component: markRaw(AButtonGroup),
		label: "Направление",
		value: String(DIRECTIONS_LIST[0]?.value ?? ""),
		items: DIRECTIONS_LIST,
	},
	{
		component: markRaw(AButtonGroup),
		label: "Статус",
		value: String(STATUSES_LIST[0]?.value ?? ""),
		items: STATUSES_LIST,
	},
	{
		component: markRaw(AButtonGroup),
		label: "Результат",
		value: String(RESULTS_LIST[0]?.value ?? ""),
		items: RESULTS_LIST,
	},
];

const filters = ref<TFilterItem[]>(createFilters());
const mobFilters = ref<FiltersExpose|null>(null);
const deskFilters = ref<FiltersExpose|null>(null);
const showMobFilters = ref(false);

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
