<template>
	<div class="group flex flex-col bg-neutral-100 border border-solid border-neutral-200 rounded-12 p-20 gap-16 w-full shadow-sm hover:shadow-md hover:border-neutral-300/80 transition relative">
		<div class="flex items-center justify-between gap-12 min-w-0">
			<span class="text-13 font-medium text-neutral-500 truncate" :title="card.title">
				{{ card.title }}
			</span>
			<div 
				v-if="icon" 
				class="flex items-center justify-center p-8 rounded-8 bg-neutral-200/50 text-neutral-600 transition group-hover:scale-105 group-hover:bg-primary-50/50 group-hover:text-primary-600 shrink-0"
			>
				<component
					:is="icon"
					class="w-20 h-20"
				/>
			</div>
		</div>
		<div
			class="text-28 lg:text-34 font-bold text-neutral-950 leading-none tracking-tight transition-transform group-hover:translate-x-1"
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
	card: TStatisticsCard;
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
