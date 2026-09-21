<template>
	<div
		class="flex flex-col lg:flex-row justify-between lg:gap-6 rounded-8 bg-neutral-100/80 border-solid border border-white/5"
		:class="[showCharts && 'lg:col-start-2 lg:col-end-4']"
	>
		<div class="flex flex-col lg:flex-row justify-between gap-32 p-16 lg:grow">
			<div class="flex flex-col justify-between gap-32 lg:grow">
				<div class="flex items-center justify-between">
					<h3 class="text-12 lg:text-16 uppercase">Активные позиции</h3>
					<div v-if="isDesktop ? !showCharts : true" class="flex items-center gap-8">
						<IconShelfPositionSharp class="w-22 lg:w-26 h-18 lg:h-22 text-primary-800" />
						<AButton class="lg:hidden" :disabled="!tradeStore.tradesMap.size" @click="showCharts = !showCharts">
							<IconArrowDown class="w-22 h-22" :class="[showCharts && 'rotate-x-180']" />
						</AButton>
					</div>
				</div>
				<div class="flex flex-col gap-8">
					<span
						class="text-18 font-semibold"
						:class="[
							showCharts && 'lg:text-46',
							!showCharts && 'lg:text-36',
						]"
					>{{ prettyCount }}</span>
					<ul class="flex gap-16">
						<li
							v-for="(item, idx) in margin"
							:key="idx"
							class="flex flex-col text-11 font-medium"
							:class="[
								idx !== 0 && 'pl-16 border-l-1 border-solid border-l-white/5',
								showCharts && 'lg:text-16',
								!showCharts && 'lg:text-14',
							]"
						>
							<span class="text-white/80">{{ item.title }}</span>
							<span class="text-primary-800">{{ item.value }}</span>
						</li>
					</ul>
				</div>
			</div>
			<div
				v-if="showCharts"
				class="flex flex-col lg:flex-row h-350 lg:h-250 lg:grow"
			>
				<VChart class="min-w-0 w-full min-h-0 h-full" :option="marginView.options" />
				<ul class="grid w-full grid-cols-2 gap-x-16 gap-y-12 lg:gap-x-32 lg:w-auto lg:pr-12">
					<li
						v-for="item in marginView.legend"
						:key="item.name"
						:title="item.name"
						class="flex items-center justify-center lg:justify-start gap-8 min-w-0"
					>
						<span class="w-10 h-10 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />
						<div class="flex flex-col min-w-0 text-12 lg:text-16 leading-tight">
							<span class="truncate">{{ item.name }}</span>
							<span class="text-white/60">{{ item.percent }}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<AButton class="hidden lg:flex justify-center items-center w-22 rounded-tr-8 rounded-br-8 h-full" :mode="ButtonMode.NEUTRAL_FILL" :disabled="!tradeStore.tradesMap.size" @click="showCharts = !showCharts">
			<IconArrowDown class="-rotate-z-90 w-22 h-22 text-white/80" :class="[showCharts && 'rotate-z-90']" />
		</AButton>
	</div>
</template>
<script setup lang="ts">
import IconShelfPositionSharp from "@/assets/icons/shelf-position-sharp.svg";
import IconArrowDown from "@/assets/icons/keyboard-arrow-down-rounded.svg";
import AButton from "@/components/atoms/AButton.vue";
import Chart from "@/models/Chart";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useTradeStore } from "@/store/useTradeStore";

const dashboardStore = useDashboardStore();
const tradeStore = useTradeStore();

const { isDesktop } = useDevice();

const showCharts = useState("show-margin-chart", () => false);

// Подпись состава позиций, используется как ключ кеша диаграммы.
const signature = computed(() =>
	tradeStore.getAllTrades()
		.map((t) => `${t.symbol}:${t.amount}:${t.entryPrice}:${t.leverage}`)
		.join("|") + String(dashboardStore.data.usedMargin)
);

/**
 * Собирает данные для диаграммы и легенды.
 *
 * Результат кешируется через `useMemoize`: пока подпись не изменилась, возвращается
 * тот же объект, и `VChart` не вызывает `setOption` повторно.
 *
 * @returns Объект с полями:
 * - `options`: опции ECharts для `VChart`;
 * - `legend`: элементы HTML-легенды (символ, доля в процентах, цвет сектора).
 */
const getMarginView = useMemoize((_signature: string) => {
	const chart = Chart.fromTradesByMargin(tradeStore.getAllTrades(), dashboardStore.data.usedMargin);
	const total = dashboardStore.data.usedMargin;

	return {
		options: chart.getComputedOptions(),
		legend: chart.data.map((item, idx) => ({
			name: String(item.name),
			percent: formatNum(total ? item.value / total : 0, { style: "percent" }),
			color: CHART_COLORS.color.positions[idx] ?? "",
		})),
	};
});

const marginView = computed(() => getMarginView(signature.value));

const margin = computed(() => [
	{
		title: "Маржи используется",
		value: formatNum(dashboardStore.data.usedMargin, { currency: "USD", style: "currency" }),
	},
	{
		title: "Маржи доступно",
		value: formatNum(dashboardStore.data.availableMargin, { currency: "USD", style: "currency" }),
	},
]);

const prettyCount = computed(() => formatNum(dashboardStore.data.activePositionsCount, { padZero: true }));

// кеш живёт только пока жив компонент
onScopeDispose(() => getMarginView.clear());
</script>
