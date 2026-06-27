<template>
	<section class="flex flex-col gap-16">
		<div class="flex items-center justify-between">
			<h2 class="font-bold text-20">Активные сделки</h2>
			<AButton class="py-4 px-12 rounded-12 text-12" mode="remove-border" @click="showModal = true">Закрыть все</AButton>
		</div>
		<div class="flex flex-col gap-12">
			<MobTradeCard
				v-for="trade in trades"
				:key="trade.id"
				:trade="trade"
				@click-by-controls="selectedTrade = trade"
			/>
		</div>
	</section>
	<Teleport to="body">
		<Modal v-model="showModal" @close="selectedTrade = undefined">
			<TradeControlsList :preset-menu="presetControlsList" :trade="selectedTrade" />
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import MobTradeCard from "@/components/molecules/index/MobTradeCard.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import AButton from "@/components/atoms/AButton.vue";
import TradeControlsList from "@/components/molecules/index/TradeControlsList.vue";

defineProps<{ trades: Trade[] }>();

const selectedTrade = ref<Trade|undefined>(undefined);
const showModal = ref(false);

const presetControlsList = computed(() => selectedTrade.value ? "trade" : "trades");

watch(selectedTrade, (v) => showModal.value = !!v);
</script>
