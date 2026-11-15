<template>
	<div class="flex flex-col bg-neutral-200 border border-solid border-neutral-300 rounded-12 p-20 gap-16 w-full relative">
		<div class="flex items-center justify-between gap-12 min-w-0">
			<span class="text-13 lg:text-16 font-medium text-neutral-800 truncate" :title="card.title">
				{{ card.title }}
			</span>
			<div 
				v-if="icon" 
				class="flex items-center justify-center p-8 rounded-8 bg-neutral-400 text-neutral-800 transition shrink-0"
			>
				<component
					:is="icon"
					class="w-20 h-20"
				/>
			</div>
		</div>
		<div
			class="text-28 lg:text-34 font-bold text-neutral-950 leading-none tracking-tight"
			:class="card.classesValue"
		>
			{{ value }}
		</div>
		<slot v-bind="{ card }" />
	</div>
</template>

<script setup lang="ts">
import IconArrowsMoreUpRounded from "@/assets/icons/arrows-more-up-rounded.svg";
import IconCardTravelOutlineRounded from "@/assets/icons/card-travel-outline-rounded.svg";
import IconMoneyBagOutlineRounded from "@/assets/icons/money-bag-outline-rounded.svg";

const { card } = defineProps<{
	card: StatisticsCard;
}>();

const icon = computed(() => {
	switch (card.icon) {
		case "arrows-more-up-rounded":
			return IconArrowsMoreUpRounded;
		case "card-travel-outline-rounded":
			return IconCardTravelOutlineRounded;
		case "money-bag-outline-rounded":
			return IconMoneyBagOutlineRounded;
		default:
			return null;
	}
});

const value = computed(() => {
	if (card.normalizer instanceof Function) return card.normalizer(card.value);
	return card.value;
});
</script>
