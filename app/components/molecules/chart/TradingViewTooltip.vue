<template>
	<div
		class="absolute w-160 z-10 box-border p-8 text-16 leading-normal rounded-4 border pointer-events-none"
		:style="{
			left: `${left}px`,
			top: `${top}px`,
			width: `${width}px`,
			color: TRADING_VIEW_THEME.tooltip.text,
			background: TRADING_VIEW_THEME.tooltip.bg,
			borderColor: TRADING_VIEW_THEME.tooltip.border,
		}"
	>
		<div class="mb-4 opacity-70">{{ formattedTime }}</div>
		<div>Цена открытия: <span :style="{ color }">{{ formattedOpen }}</span></div>
		<div>Макс цена: <span :style="{ color }">{{ formattedHigh }}</span></div>
		<div>Мин цена: <span :style="{ color }">{{ formattedLow }}</span></div>
		<div>Цена закрытия: <span :style="{ color }">{{ formattedClose }}</span></div>
		<div>Объем: {{ formattedVolume }}</div>
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

const color = computed(() => props.candle.close >= props.candle.open ? TRADING_VIEW_THEME.up : TRADING_VIEW_THEME.down);

const formattedTime = computed(() => formatDateTime(props.time, { timeZone: "UTC" }));
const formattedOpen = computed(() => formatNum(props.candle.open, priceOptions));
const formattedHigh = computed(() => formatNum(props.candle.high, priceOptions));
const formattedLow = computed(() => formatNum(props.candle.low, priceOptions));
const formattedClose = computed(() => formatNum(props.candle.close, priceOptions));
const formattedVolume = computed(() => formatNum(String(props.volume), { style: "decimal", padZero: true }));
</script>
