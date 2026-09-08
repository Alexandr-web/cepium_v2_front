<template>
	<section class="flex flex-col gap-16">
		<div class="flex lg:hidden items-center justify-between">
			<h2 class="font-bold text-20" data-allow-mismatch="">
				Активные сделки <span class="text-14 text-white/50">({{ tradeStore.trades.length }})</span>
			</h2>
			<AButton
				v-if="tradeStore.trades.length"
				class="py-4 px-12 rounded-12 text-12"
				mode="remove-border"
				:disabled="isPendingRemovePosition"
				data-allow-mismatch=""
				@click="openAllControls"
			>Закрыть все</AButton>
		</div>
		<div v-if="tradeStore.trades.length" class="flex lg:hidden flex-col gap-12" data-allow-mismatch="">
			<MobTradeCard
				v-for="trade in tradeStore.trades"
				:key="trade.id"
				:disabled="isPendingRemovePosition"
				:trade="trade"
				@controls="openTradeControls(trade)"
			/>
		</div>
		<Empty v-else class="lg:hidden" />
		<TradesTable
			:disabled="isPendingRemovePosition"
			data-allow-mismatch=""
			@remove-one="removePosition"
			@remove-all="() => console.log('remove all')"
			@select-symbol="selectSymbol"
		/>
	</section>
	<Teleport to="body">
		<Modal :model-value="showControlsModal && !isDesktop" @close="closeControlsModal">
			<div class="flex flex-col gap-5">
				<TradeControlsList
					:preset-menu="presetControlsList"
					:trade="selectedTrade"
					@remove-one="removePosition"
					@remove-all="() => console.log('remove all')"
				/>
				<CoinChart v-if="selectedSymbol" :symbol="selectedSymbol" />
			</div>
		</Modal>
		<Modal :model-value="!!selectedSymbol && isDesktop" @close="selectedSymbol = null">
			<CoinChart v-if="selectedSymbol" :symbol="selectedSymbol" />
		</Modal>
	</Teleport>
</template>

<script setup lang="ts">
import type Trade from "@/models/Trade";
import MobTradeCard from "@/components/molecules/trade/MobCard.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import AButton from "@/components/atoms/AButton.vue";
import TradeControlsList from "@/components/molecules/trade/ControlsList.vue";
import TradesTable from "@/components/molecules/trade/Table.vue";
import Empty from "@/components/molecules/common/Empty.vue";
import CoinChart from "@/components/molecules/widgets/CoinChart.vue";
import { useRemoveOne } from "@/composables/api/useOrders";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useTradeStore } from "@/store/useTradeStore";
import { useCoinGeckoSearch } from "@/composables/api/useCoinGecko";

const { isDesktop } = useDevice();
const { findCoinId } = useCoinGeckoSearch();

const exchangeStore = useExchangeStore();
const tradeStore = useTradeStore();

const {
	isPending: isPendingRemovePosition,
	mutate,
} = useRemoveOne(
	exchangeStore.activeExchange ?? "",
	(id: string) => tradeStore.trades = tradeStore.trades.filter((t) => t.id !== id)
);

const { $events } = useNuxtApp();

const selectedSymbol = ref<string | null>(null);
const selectedTrade = ref<Trade | null>(null);
const showControlsModal = ref(false);

const presetControlsList = computed(() => selectedTrade.value ? "trade" : "trades");

/**
 * Открывает мобильную модалку управления конкретной сделкой
 * и подгружает график монеты по символу этой сделки.
 *
 * @param trade - Сделка, для которой открываются контролы.
 */
const openTradeControls = async (trade: Trade) => {
	selectedTrade.value = trade;
	showControlsModal.value = true;
	await selectSymbol(trade.symbol);
};

/**
 * Открывает мобильную модалку управления всеми сделками разом
 * (preset "trades", без привязки к конкретной позиции).
 * Сбрасывает выбранный символ, так как график для группового
 * действия не показывается.
 */
const openAllControls = () => {
	selectedTrade.value = null;
	showControlsModal.value = true;
	selectedSymbol.value = null;
};

/**
 * Закрывает мобильную модалку управления сделками и сбрасывает
 * связанный с ней стейт: выбранную сделку и выбранный символ монеты.
 */
const closeControlsModal = () => {
	showControlsModal.value = false;
	selectedTrade.value = null;
	selectedSymbol.value = null;
};

/**
 * Удаляет позицию по сделке. На мобилке предварительно закрывает
 * модалку управления, на десктопе оставляет её открытой.
 *
 * @param trade - Сделка, которую нужно удалить.
 */
const removePosition = async (trade: Trade) => {
	if (!isDesktop) closeControlsModal();
	await mutate(trade.id);
};

/**
 * Находит id монеты в CoinGecko по её символу и, если найден,
 * устанавливает его как выбранный для отображения графика.
 *
 * @param s - Символ монеты (например, "BTC/USDT:USDT").
 */
const selectSymbol = async (s: string) => {
	const id = await findCoinId(s);
	if (id) selectedSymbol.value = id;
};

onMounted(() => $events.subscribeDeals());
onUnmounted(() => $events.unsubscribeDeals());
</script>
