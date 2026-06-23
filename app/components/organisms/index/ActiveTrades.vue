<template>
	<section class="flex flex-col gap-16">
		<div class="flex items-center justify-between">
			<h2 class="font-bold text-20">Активные сделки</h2>
			<AButton class="py-4 px-12 rounded-12 text-12" mode="remove-border" @click="showModal = true">Закрыть все</AButton>
		</div>
		<div class="flex flex-col gap-12">
			<TradeCard v-for="trade in trades" :key="trade.id" :trade="trade" />
		</div>
	</section>
	<Teleport to="body">
		<Modal v-model="showModal">
			<AButton class="w-full rounded-8 py-8 px-16" mode="remove-fill">Закрыть все позиции</AButton>
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import TradeCard from "@/components/molecules/index/TradeCard.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import AButton from "@/components/atoms/AButton.vue";

defineProps<{ trades: Trade[] }>();

const showModal = ref(false);
</script>
