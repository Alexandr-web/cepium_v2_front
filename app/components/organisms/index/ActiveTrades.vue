<template>
	<section class="flex flex-col gap-16">
		<div class="flex lg:hidden items-center justify-between">
			<h2 class="font-bold text-20" data-allow-mismatch="">
				Активные сделки <span v-if="tradeStore.tradesMap.size" class="text-14 text-white/50">({{ tradeStore.tradesMap.size }})</span>
			</h2>
			<AButton
				v-if="tradeStore.tradesMap.size"
				class="py-4 px-12 rounded-12 text-12"
				:mode="ButtonMode.REMOVE_BORDER"
				:disabled="isPendingRemovePosition"
				data-allow-mismatch=""
				@click="openAllControls"
			>Закрыть все</AButton>
		</div>
		<div class="flex flex-col lg:flex-row lg:justify-between gap-8">
			<AInput
				v-model.trim="search"
				placeholder="Поиск по позициям..."
				prepend-icon="search-rounded"
				class="lg:grow lg:h-full lg:min-h-0"
				:disabled="!tradeStore.tradesMap.size || !tradeStore.isLoaded"
			/>
			<ATabs
				class="lg:h-full lg:min-h-0"
				:disabled="!tradeStore.tradesMap.size || !tradeStore.isLoaded"
				:items="tabs"
				:active-value="activeTab"
				@select="(v: TabsValues) => activeTab = v"
			/>
		</div>
		<template v-if="!isDesktop">
			<div v-if="displayTrades.length" class="flex flex-col gap-12" data-allow-mismatch="">
				<MobTradeCard
					v-for="trade in displayTrades"
					:key="trade.id"
					:disabled="isPendingRemovePosition || !tradeStore.isLoaded"
					:trade="trade"
					@controls="openTradeControls(trade)"
				/>
			</div>
			<Empty v-else :is-pending="!tradeStore.isLoaded" />
		</template>
		<TradesTable
			v-else
			:disabled="isPendingRemovePosition || !tradeStore.isLoaded"
			data-allow-mismatch=""
			:trades="displayTrades"
			@remove-one="removePosition"
			@remove-all="removePositions"
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
					@remove-all="removePositions"
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
import ATabs from "@/components/atoms/ATabs.vue";
import AInput from "@/components/atoms/AInput.vue";
import { useRemoveOne } from "@/composables/api/useOrders";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useTradeStore } from "@/store/useTradeStore";
import { useCoinGeckoSearch } from "@/composables/api/useCoinGecko";

enum TabsValues {
	ALL = "all",
	SHORT = "short",
	LONG = "long",
	POSITIVE_PNL = "positive-pnl",
	NEGATIVE_PNL = "negative-pnl",
};

const { isDesktop } = useDevice();
const { findCoinId } = useCoinGeckoSearch();

const exchangeStore = useExchangeStore();
const tradeStore = useTradeStore();

const {
	isPending: isPendingRemovePosition,
	mutateAsync,
} = useRemoveOne(
	exchangeStore.activeExchange ?? "",
	(id: string) => tradeStore.tradesMap.delete(id)
);

const { $events } = useNuxtApp();

const search = ref("");

const activeTab = ref<TabsValues>(TabsValues.ALL);
const tabs = ref<SelectItem[]>([
	{ label: "Все", value: TabsValues.ALL },
	{ label: "Шорт", value: TabsValues.SHORT },
	{ label: "Лонг", value: TabsValues.LONG },
	{ label: "Положительный профит", value: TabsValues.POSITIVE_PNL },
	{ label: "Отрицательный профит", value: TabsValues.NEGATIVE_PNL },
]);

const displayTrades = computed(() =>
	tradeStore.getAllTrades()
		.filter((t) => {
			const isSearchMatch = search.value.length >= 2
				? t.shortSymbol.toLowerCase().includes(search.value.toLowerCase())
				: true;

			switch (activeTab.value) {
				case TabsValues.SHORT:
					return isSearchMatch && t.direction === TradeDirection.SHORT;
				case TabsValues.LONG:
					return isSearchMatch && t.direction === TradeDirection.LONG;
				case TabsValues.POSITIVE_PNL:
					return isSearchMatch && t.pnl > 0;
				case TabsValues.NEGATIVE_PNL:
					return isSearchMatch && t.pnl <= 0;
				default:
					return isSearchMatch;
			}
		})
);

const selectedSymbol = ref<string | null>(null);
const selectedTrade = ref<Trade | null>(null);
const showControlsModal = ref(false);

const presetControlsList = computed(() => selectedTrade.value ? ControlsListPreset.TRADE : ControlsListPreset.TRADES);

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
 * модалку управления
 *
 * @param trade - Сделка, которую нужно удалить.
 */
const removePosition = async (trade: Trade) => {
	if (!isDesktop) closeControlsModal();
	await mutateAsync(trade.id);
};

/**
 * Удаляет все отображаемые сделки. На мобилке предварительно закрывает
 * модалку управления
 */
const removePositions = async () => {
	if (!isDesktop) closeControlsModal();

	const prms = displayTrades.value.map((t) => mutateAsync(t.id));
	await Promise.all(prms);
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
