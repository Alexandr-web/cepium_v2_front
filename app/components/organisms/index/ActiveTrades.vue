<template>
	<section class="flex flex-col gap-16">
		<ClientOnly>
			<div class="flex lg:hidden items-center justify-between">
				<h2 class="font-bold text-20">Активные сделки <span class="text-14 text-white/50">({{ trades.length }})</span></h2>
				<AButton
					v-if="trades.length"
					class="py-4 px-12 rounded-12 text-12"
					mode="remove-border"
					:disabled="isPendingRemovePosition"
					@click="showModal = true"
				>Закрыть все</AButton>
			</div>
			<div v-if="trades.length" class="flex lg:hidden flex-col gap-12">
				<MobTradeCard
					v-for="trade in trades"
					:key="trade.id"
					:disabled="isPendingRemovePosition"
					:trade="trade"
					@controls="selectedTrade = trade"
				/>
			</div>
			<Empty v-else class="lg:hidden" />
			<TradesTable
				:trades="trades"
				:disabled="isPendingRemovePosition"
				@remove-one="removePosition"
				@remove-all="() => console.log('remove all')"
			/>
		</ClientOnly>
	</section>
	<Teleport to="body">
		<Modal v-model="showModal" @close="selectedTrade = null">
			<TradeControlsList
				:preset-menu="presetControlsList"
				:trade="selectedTrade"
				@remove-one="removePosition"
				@remove-all="() => console.log('remove all')"
			/>
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
import { useRemoveOne } from "@/composables/api/useOrders";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useTradeStore } from "@/store/useTradeStore";

defineProps<{ trades: Trade[] }>();

const { isDesktop } = useDevice();

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

const selectedTrade = ref<Trade|null>(null);
const showModal = ref(false);

const presetControlsList = computed(() => selectedTrade.value ? "trade" : "trades");

watch(selectedTrade, (v) => showModal.value = !!v);

const removePosition = async (trade: Trade) => {
	if (!isDesktop) selectedTrade.value = null;
	await mutate(trade.id);
};

onMounted(() => $events.subscribeDeals());
onUnmounted(() => $events.unsubscribeDeals());
</script>
