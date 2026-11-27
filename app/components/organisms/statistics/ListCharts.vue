<template>
	<section class="flex flex-col gap-12">
		<div class="flex lg:flex-row-reverse justify-between gap-12">
			<Tooltip :disabled="!isDesktop">
				<template #trigger>
					<AButton
						class="rounded-12 p-8 lg:self-start"
						:mode="ButtonMode.PRIMARY_BORDER"
						:disabled="isPendingReport"
						@click="loadReport"
					>
						<IconReport class="w-22 lg:w-26 h-22 lg:h-26 text-white/80" />
					</AButton>
				</template>
				<template #content>
					<p>Скачать отчет за выбранный период</p>
				</template>
			</Tooltip>
			<Filters
				:filters="filters"
				:disabled="isPendingStatistics || isPendingStrategy"
			/>
		</div>
		<div class="flex flex-col gap-12">
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
import Tooltip from "@/components/molecules/common/Tooltip.vue";
import IconReport from "@/assets/icons/report.svg";

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

const isDesktop = useMediaQuery("(min-width: 1024px)");

const PERIOD_LIST: SelectItem[] = [
	{ label: "За все время", value: "all" },
	{ label: "Неделя", value: "week" },
	{ label: "Месяц", value: "month" },
	{ label: "Год", value: "year" },
];

const isPendingReport = ref(false);
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
	isPendingReport.value = true;

	try {
		const blob = await loadStatReport({ query: getFiltersQuery(filters.value) });
		downloadBlob(blob, "report.xlsx");
	} catch (err) {
		console.error(err);
	} finally {
		isPendingReport.value = false;
	}
};

watch(filtersValues, loadData);

onMounted(loadData);
</script>
