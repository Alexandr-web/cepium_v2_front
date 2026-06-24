<template>
	<ul class="flex flex-col gap-8 lg:gap-16">
		<li v-for="(item, idx) in menu" :key="idx">
			<AButton
				class="w-full rounded-8 py-8 px-16"
				mode="remove-fill"
				@click="item.onClick"
			>{{ item.label }}</AButton>
		</li>
	</ul>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import AButton from "@/components/atoms/AButton.vue";

const { presetMenu, trade } = defineProps<{ presetMenu: string; trade?: Trade | null }>();

const tradeMenu = computed(() => [
	{
		label: `Закрыть позицию ${trade?.symbol}`,
		onClick: () => console.log("close trade: ", trade?.id),
	},
]);

const tradesMenu = computed(() => [
	{
		label: "Закрыть все позиции",
		onClick: () => console.log("close all trades"),
	},
]);

const menu = computed(() => {
	switch (presetMenu) {
		case "trade":
			return tradeMenu.value;
		case "trades":
			return tradesMenu.value;
		default:
			return [];
	}
});
</script>
