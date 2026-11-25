<template>
	<section class="flex flex-col gap-36 lg:gap-12 p-12 lg:p-24 bg-neutral-200 min-h-screen rounded-12">
		<Filters :filters="filters" :disabled="isPendingStatistics || isPendingStrategy">
			<template #footer>
				<AButton
					class="rounded-12 lg:ml-auto lg:self-start w-full lg:w-auto px-24 py-12 lg:py-8 lg:text-16"
					:mode="ButtonMode.PRIMARY_BORDER"
					@click="loadReport"
				>Скачать отчет</AButton>
			</template>
		</Filters>
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-24">
			<div
				v-for="(item, idx) in charts"
				:key="idx"
				class="flex flex-col bg-neutral-300/50 rounded-12 p-12 lg:p-20 gap-16"
				:class="item.classes"
			>
				<h3 class="font-medium text-neutral-700 lg:text-18">{{ item.label }}</h3>
				<div class="h-200 lg:h-300 w-full rounded-12" :class="[isPendingCharts && 'overflow-hidden']">
					<VChart
						v-if="!item.isEmpty"
						:loading="isPendingCharts"
						:loading-options="CHART_COLORS.loading"
						:option="item.options"
						class="w-full h-full"
					/>
					<Empty v-else class="justify-start" />
				</div>
			</div>
		</div>
	</section>
</template>
<script setup lang="ts">
import { useCharts, useReport } from "@/composables/api/useStatistics";
import { useProfitByDayChart, useOrdersBySymbolChart, useOrdersWinLossChart } from "@/composables/useChart";
import Filters from "@/components/molecules/common/Filters.vue";
import ASelect from "@/components/atoms/ASelect.vue";
import Empty from "@/components/molecules/common/Empty.vue";
import AButton from "@/components/atoms/AButton.vue";

const props = withDefaults(
	defineProps<{
		strategies?: StrategyEntity[];
		isPendingStrategy?: boolean;
		isPendingStatistics?: boolean;
	}>(),
	{
		strategies: () => [],
		isPendingStrategy: false,
		isPendingStatistics: false,
	}
);

const { load: loadStatReport } = useReport();
const { searchData } = useCharts();

const PERIOD_LIST: SelectItem[] = [
	{ label: "За все время", value: "all" },
	{ label: "Неделя", value: "week" },
	{ label: "Месяц", value: "month" },
	{ label: "Год", value: "year" },
];

const isPendingCharts = ref(false);
const data = ref<Partial<StatisticsChartsResponse["data"]>>({});

const { isEmpty: isEmptyProfitByDay, options: profitByDayOptions } = useProfitByDayChart(() => data.value.profit_dynamics);
const { isEmpty: isEmptyOrdersBySymbol, options: optionsOrdersBySymbol } = useOrdersBySymbolChart(() => data.value.trades_by_asset);
const { isEmpty: isEmptyOrdersWinLoss, options: optionsOrdersWinLoss } = useOrdersWinLossChart(() => data.value.win_loss_ratio);

const filters = ref<FilterItem[]>([
	{
		name: "period",
		component: markRaw(ASelect),
		label: "Период",
		value: String(PERIOD_LIST[0]?.value ?? ""),
		items: PERIOD_LIST,
		classes: "min-w-200",
	},
	{
		name: "strategyName",
		component: markRaw(ASelect),
		label: "Стратегия",
		value: String(props.strategies[0]?.name ?? ""),
		items: props.strategies.map((s) => ({ label: s.name, value: s.name })),
		classes: "min-w-300",
	},
]);

const filtersValues = computed(() => filters.value.map((i) => i.value));

const charts = computed(() => [
	{
		label: "Динамика профита",
		classes: "lg:col-span-4",
		options: profitByDayOptions.value,
		isEmpty: isEmptyProfitByDay.value,
	},
	{
		label: "Количество сделок",
		classes: "lg:col-span-3",
		options: optionsOrdersBySymbol.value,
		isEmpty: isEmptyOrdersBySymbol.value,
	},
	{
		label: "Соотношение Win/Loss",
		options: optionsOrdersWinLoss.value,
		isEmpty: isEmptyOrdersWinLoss.value,
	},
]);

const loadData = async () => {
	isPendingCharts.value = true;

	try {
		const res = await searchData({ query: getFiltersQuery(filters.value) });
		data.value = res.data;
	} catch (err) {
		console.error(err);
	} finally {
		isPendingCharts.value = false;
	}
};

const loadReport = async () => {
	try {
		const blob = await loadStatReport({ query: getFiltersQuery(filters.value) });
		downloadBlob(blob, "report.xlsx");
	} catch (err) {
		console.error(err);
	}
};

watch(filtersValues, loadData);

onMounted(loadData);
</script>
