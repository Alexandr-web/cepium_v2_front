<template>
	<ul class="flex flex-col gap-8 lg:gap-16">
		<li v-for="(item, idx) in menu" :key="idx">
			<AButton
				class="w-full rounded-8 py-8 px-16"
				:mode="ButtonMode.REMOVE_FILL"
				@click="item.onClick"
			>{{ item.label }}</AButton>
		</li>
	</ul>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import AButton from "@/components/atoms/AButton.vue";

const props = withDefaults(
	defineProps<{
		presetMenu?: ControlsListPreset;
		trade?: Trade|null;
	}>(),
	{
		presetMenu: ControlsListPreset.TRADES,
		trade: null,
	}
);

const emits = defineEmits(["removeOne", "removeAll"]);

const tradeMenu = computed(() => [
	{
		label: `Закрыть позицию ${props.trade?.symbol}`,
		onClick: () => emits("removeOne", props.trade),
	},
]);

const tradesMenu = computed(() => [
	{
		label: "Закрыть все позиции",
		onClick: () => emits("removeAll"),
	},
]);

const menu = computed(() => {
	switch (props.presetMenu) {
		case ControlsListPreset.TRADE:
			return tradeMenu.value;
		case ControlsListPreset.TRADES:
			return tradesMenu.value;
		default:
			return [];
	}
});
</script>
