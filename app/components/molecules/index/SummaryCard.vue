<template>
	<div class="flex flex-col justify-between gap-32 rounded-8 bg-neutral-100/80 border-solid border border-white/5 p-16">
		<div class="flex items-center justify-between">
			<h3 class="text-12 lg:text-16 uppercase">{{ card.title }}</h3>
			<component
				:is="icon"
				v-if="icon"
				class="w-22 lg:w-26 h-18 lg:h-22 text-primary-800"
			/>
		</div>
		<div class="flex flex-col gap-8">
			<span
				class="text-18 font-semibold"
				:class="[
					card.type === 'balance' && 'lg:text-48',
					card.type !== 'balance' && 'lg:text-36',
					(card.type === 'pnl' && Number(card.value) > 0) && 'text-tertiary-800',
					(card.type === 'pnl' && Number(card.value) < 0) && 'text-secondary-500',
					card.type !== 'pnl' && 'text-white'
				]"
			>{{ card.formattedValue }}</span>
			<SummaryNote :card="card" />
		</div>
	</div>
</template>
<script setup lang="ts">
import SummaryNote from "@/components/molecules/index/SummaryNote.vue";
import IconArrowsMoreUpRounded from "@/assets/icons/arrows-more-up-rounded.svg";
import IconShelfPositionSharp from "@/assets/icons/shelf-position-sharp.svg";
import IconMoneyBagOutlineRounded from "@/assets/icons/money-bag-outline-rounded.svg";

const props = defineProps<{
	card: TIndexCardSummary;
}>();

const icon = computed(() => {
	switch (props.card.icon) {
		case "arrows-more-up-rounded":
			return IconArrowsMoreUpRounded;
		case "shelf-position-sharp":
			return IconShelfPositionSharp;
		case "money-bag-outline-rounded":
			return IconMoneyBagOutlineRounded;
		default:
			return null;
	}
});
</script>
