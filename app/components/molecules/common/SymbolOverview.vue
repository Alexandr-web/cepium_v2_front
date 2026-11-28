<template>
	<div class="flex flex-col lg:flex-row-reverse gap-24">
		<div class="flex flex-col gap-12 lg:basis-[35%]">
			<div class="flex flex-col gap-12 lg:rounded-12 lg:p-12 lg:bg-neutral-100">
				<div class="flex items-center gap-8">
					<AImage
						:src="urlIconSymbol"
						:preset="ImagePreset.COIN"
						loading="lazy"
						:alt="symbol"
					/>
					<h3 class="text-neutral-800 uppercase font-semibold text-24 lg:text-28">{{ bybitSymbol }}</h3>
				</div>
				<div class="flex items-end gap-12">
					<span class="text-white text-22 lg:text-24 font-medium">{{ formatLastPrice }}</span>
					<span
						class="text-14 lg:text-18"
						:class="[
							price24hPcnt > 0 && 'text-tertiary-500',
							price24hPcnt < 0 && 'text-secondary-500',
							!price24hPcnt && 'text-neutral-700'
						]"
					>{{ formatPrice24hPcnt }}</span>
				</div>
			</div>
			<div class="flex flex-col gap-8 rounded-12 p-12 lg:grow bg-neutral-300 lg:min-h-0">
				<Collapse v-for="collapse in info" :key="collapse.id" :label="collapse.label" :disabled="isEmpty">
					<ul class="flex flex-col gap-8 px-16">
						<li
							v-for="(item, idx) in collapse.list"
							:key="`${symbol}-${activeInterval}-${idx}`"
							class="flex items-center justify-between gap-6"
						>
							<span class="text-14 lg:text-16 font-medium text-neutral-950">{{ item.label }}</span>
							<span class="text-14 lg:text-16 font-light text-primary-500">{{ item.value }}</span>
						</li>
					</ul>
				</Collapse>
			</div>
		</div>
		<div class="flex flex-col relative lg:sticky lg:top-0 bg-neutral-300 p-12 gap-8 rounded-12 lg:basis-[65%] lg:self-start">
			<IconLoader v-if="isLoading && !isEmpty" class="absolute top-0 left-0 right-0 bottom-0 m-auto w-40 h-40 text-white" />
			<ATabs
				class="self-start"
				:items="intervalTabs"
				:active-value="activeInterval"
				:disabled="isLoading || isEmpty"
				@select="(v: BybitInterval) => activeInterval = v"
			/>
			<div id="trading-view-chart" class="w-full h-350 lg:h-500"/>
			<Empty v-if="isEmpty" class="absolute z-999 self-center my-auto top-0 bottom-0">
				<p class="text-neutral-800">Монета не найдена</p>
			</Empty>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useBybitKlines } from "@/composables/api/useBybitKlines";
import { useTradingViewChart } from "@/composables/useTradingView";
import AImage from "@/components/atoms/AImage.vue";
import ATabs from "@/components/atoms/ATabs.vue";
import Collapse from "@/components/molecules/common/Collapse.vue";
import Empty from "@/components/molecules/common/Empty.vue";
import IconLoader from "@/assets/icons/loader.svg";

const props = withDefaults(
	defineProps<{ symbol?: string; interval: BybitInterval; }>(),
	{
		symbol: undefined,
	}
);

const activeInterval = ref(props.interval);

const { fetchKlines } = useBybitKlines();
const { isConnected, ticker, kline, build, reset } = useTradingViewChart(activeInterval, { containerSelector: "trading-view-chart" });
const {
	formatHighPrice24h,
	formatLowPrice24h,
	formatVolume24h,
	formatTurnover24h,
	formatKlineOpen,
	formatKlineHigh,
	formatKlineLow,
	formatKlineVolume,
	formatKlineTurnover,
	formatLastPrice,
	formatPrice24hPcnt,
	price24hPcnt,
} = useBybitSymbol(ticker, kline);

const bybitSymbol = computed(() => formatBybitSymbol(props.symbol));
const urlIconSymbol = computed(() => getUrlCoinIcon(String(props.symbol)));

const info24h = computed(() => [
	{ label: "Максимальная цена", value: formatHighPrice24h.value },
	{ label: "Минимальная цена", value: formatLowPrice24h.value },
	{ label: "Объем", value: formatVolume24h.value },
	{ label: "Оборот", value: formatTurnover24h.value },
]);

const klineInfo = computed(() => [
	{ label: "Цена открытия", value: formatKlineOpen.value },
	{ label: "Пиковая цена за интервал", value: formatKlineHigh.value },
	{ label: "Самая низкая цена за интервал", value: formatKlineLow.value },
	{ label: "Объем", value: formatKlineVolume.value },
	{ label: "Оборот", value: formatKlineTurnover.value },
]);

const info = computed(() => [
	{ id: 1, label: "Данные за 24 часа", list: info24h.value },
	{ id: 2, label: "Данные текущей свечи", list: klineInfo.value },
]);

const isEmpty = ref(false);
const isPending = ref(false);

const isLoading = computed(() => !isConnected.value || isPending.value);

const intervalTabs = ref<SelectItem[]>([
	{ label: "1м", value: BybitInterval.M1 },
	{ label: "3м", value: BybitInterval.M3 },
	{ label: "5м", value: BybitInterval.M5 },
	{ label: "15м", value: BybitInterval.M15 },
	{ label: "30м", value: BybitInterval.M30 },
	{ label: "1ч", value: BybitInterval.H1 },
	{ label: "2ч", value: BybitInterval.H2 },
	{ label: "4ч", value: BybitInterval.H4 },
	{ label: "6ч", value: BybitInterval.H6 },
	{ label: "12ч", value: BybitInterval.H12 },
	{ label: "1Д", value: BybitInterval.D },
	{ label: "1Н", value: BybitInterval.W },
	{ label: "1М", value: BybitInterval.M },
]);

watch(
	[() => props.symbol, activeInterval],
	async ([symbol, interval]) => {
		reset();

		if (!symbol) return;

		isEmpty.value = false;
		isPending.value = true;

		try {
			const data = await fetchKlines({ symbol: bybitSymbol.value, interval });
			isEmpty.value = !data.length;
			await build(data, bybitSymbol.value);
		} catch (err) {
			console.error(err);
		} finally {
			isPending.value = false;
		}
	},
	{ immediate: true }
);

onUnmounted(reset);
</script>
