<template>
	<section class="flex flex-col gap-12 p-12 lg:p-24 bg-black min-h-screen rounded-12">
		<Filters :filters="filters" />
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-24">
			<div
				v-for="(item, idx) in charts"
				:key="idx"
				class="flex flex-col bg-neutral-100/50 border border border-neutral-200 rounded-12 p-12 lg:p-20 gap-16"
				:class="item.classes"
			>
				<h3 class="font-medium text-neutral-700">{{ item.label }}</h3>
				<div class="h-200 lg:h-300 w-full">
					<VChart :option="item.options" class="w-full h-full" />
				</div>
			</div>
		</div>
	</section>
</template>
<script setup lang="ts">
import { useCharts } from "@/composables/api/useStatistics";
import Filters from "@/components/molecules/common/Filters.vue";
import Chart from "@/models/Chart";
import ASelect from "@/components/atoms/ASelect.vue";

const props = withDefaults(
	defineProps<{
		strategies?: StrategyEntity[];
	}>(),
	{
		strategies: () => [],
	}
);

const { searchData } = useCharts();

const PERIOD_LIST: SelectItem[] = [
	{ label: "За все время", value: "all" },
	{ label: "Неделя", value: "week" },
	{ label: "Месяц", value: "month" },
	{ label: "Год", value: "year" },
];

const data = ref<Partial<StatisticsChartsResponse["data"]>>({});

const filters = ref<FilterItem[]>([
	{
		name: "period",
		component: markRaw(ASelect),
		label: "Период",
		value: String(PERIOD_LIST[0]?.value ?? ""),
		items: PERIOD_LIST,
	},
	{
		name: "strategyName",
		component: markRaw(ASelect),
		label: "Стратегия",
		value: String(props.strategies[0]?.id ?? ""),
		items: props.strategies.map((s) => ({ label: s.name, value: s.id })),
	},
]);

const charts = computed(() => [
	{
		label: "Динамика профита",
		options: Chart.fromOrdersProfitByDay(data.value.profit_dynamics ?? []).getComputedOptions(),
		classes: "lg:col-span-4",
	},
	{
		label: "Количество сделок",
		options: Chart.fromOrdersBySymbol(data.value.trades_by_asset ?? []).getComputedOptions(),
		classes: "lg:col-span-3",
	},
	{
		label: "Соотношение Win/Loss",
		options: Chart.fromOrdersWinLoss(data.value.win_loss_ratio ?? {}).getComputedOptions(),
	},
]);

watch(
	() => filters.value.map((i) => i.value),
	async () => {
		try {
			const res = await searchData({ query: getFiltersQuery(filters.value) });
			data.value = res.data;
		} catch (err) {
			console.error(err);
		}
	},
	{ immediate: true }
);
</script>
