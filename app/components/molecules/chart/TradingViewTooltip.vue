<template>
	<div
		class="absolute z-10 p-8 text-10 lg:text-16 leading-normal rounded-6 border-solid border-neutral-400 pointer-events-none text-neutral-800 bg-neutral-200"
		:style="styles"
	>
		<div class="mb-4 opacity-70">{{ formattedTime }}</div>
		<ul class="flex flex-col gap-2">
			<li v-for="item in list" :key="item.id" class="flex justify-between gap-4 lg:gap-8 not-last:pb-2 not-last:border-b not-last:border-b-neutral-500">
				<span>{{ item.label }}</span>
				<span :class="item.classes">{{ item.value }}</span>
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
import type { CandlestickData, Time } from "lightweight-charts";

/**
 * Плавающий тултип свечного графика: показывает время, OHLC и объём свечи под курсором.
 *
 * Монтируется не через шаблон, а из `useTradingViewChart` с помощью `render(h(...), container)`
 * в контейнер графика, поэтому позицию (`left`, `top`) и ширину компонент получает пропсами.
 * Размонтирование компонента скрывает тултип.
 */
const props = withDefaults(
	defineProps<{
		time: number;
		candle: CandlestickData<Time>;
		volume?: number;
		left: number;
		top: number;
		width: number;
	}>(),
	{
		volume: undefined,
	}
);

const priceOptions = { currency: "USD", style: "currency", maximumFractionDigits: 6 } as const;

const klineClasses = computed(() => [
	props.candle.close >= props.candle.open && "text-tertiary-600",
	props.candle.close < props.candle.open && "text-secondary-600",
]);

const formattedTime = computed(() => formatDateTime(props.time, { timeZone: "UTC" }));
const formattedOpen = computed(() => formatNum(props.candle.open, priceOptions));
const formattedHigh = computed(() => formatNum(props.candle.high, priceOptions));
const formattedLow = computed(() => formatNum(props.candle.low, priceOptions));
const formattedClose = computed(() => formatNum(props.candle.close, priceOptions));
const formattedVolume = computed(() => formatNum(String(props.volume), { style: "decimal", padZero: true }));

const list = computed(() => [
	{ id: 1, classes: klineClasses.value, label: "Цена открытия:", value: formattedOpen.value },
	{ id: 2, classes: klineClasses.value, label: "Макс цена:", value: formattedHigh.value },
	{ id: 3, classes: klineClasses.value, label: "Мин цена:", value: formattedLow.value },
	{ id: 4, classes: klineClasses.value, label: "Цена закрытия:", value: formattedClose.value },
	{ id: 5, label: "Объем:", value: formattedVolume.value },
]);

const styles = computed(() => ({
	left: `${props.left}px`,
	top: `${props.top}px`,
	width: `${props.width}px`,
}));
</script>
