<template>
	<div class="flex flex-col border-1 border-solid border-white/5 rounded-8 bg-secondary-100 text-white p-8">
		<div class="flex justify-between pb-12">
			<div class="flex gap-12 items-center">
				<div class="rounded-12 w-40 h-40 flex justify-center items-center border-1 border-solid border-white/5 uppercase text-neutral-700 font-bold text-12">{{ trade.symbol }}</div>
				<div class="flex flex-col">
					<h3 class="font-bold text-14 text-white/80">{{ trade.fullSymbol }} {{ trade.direction }}</h3>
					<p class="inline-flex items-center text-12 font-medium text-white/50">
						{{ trade.margin }}
						{{ trade.prettyLeverage }}
						<span class="w-4 h-4 rounded-full bg-white/50 mx-4 block"/>
						{{ trade.prettyAmount }}
						{{ trade.symbol }}
					</p>
				</div>
			</div>
			<div
				class="flex flex-col items-end"
				:class="[
					trade.pnl >= 0 && 'text-tertiary-600',
					trade.pnl < 0 && 'text-secondary-500',
				]"
			>
				<span class="text-18 font-semibold">{{ trade.prettyPnl }}</span>
				<span class="text-12 text-medium">{{ trade.prettyPnlPercent }}</span>
			</div>
		</div>
		<div class="flex justify-between border-t-1 border-t-solid border-t-white/5 pt-12">
			<div class="flex items-center gap-16">
				<div class="flex flex-col text-10 text-white/40">
					<span class="uppercase">Вход</span>
					<span>{{ trade.prettyEntryPrice }}</span>
				</div>
				<div class="flex flex-col text-10 text-white/40">
					<span class="uppercase">Текущая цена</span>
					<span>{{ trade.prettyCurrentPrice }}</span>
				</div>
			</div>
			<div class="flex">
				<button
					class="cursor-pointer transition text-white/80 hover:text-white/90 hover:bg-neutral-400 bg-neutral-300 py-6 px-16 rounded-4 text-12"
					@click="showModal = true"
				>Управление</button>
			</div>
		</div>
	</div>
	<Teleport to="body">
		<Modal v-model="showModal">
			<AButton class="w-full rounded-8 py-8 px-16" mode="remove-fill">Закрыть {{ trade.fullSymbol }}</AButton>
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import Modal from "@/components/molecules/common/Modal.vue";
import AButton from "@/components/atoms/AButton.vue";

defineProps<{ trade: Trade }>();

const showModal = ref(false);
</script>
