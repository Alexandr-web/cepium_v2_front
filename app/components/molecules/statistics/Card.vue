<template>
	<div class="flex flex-col bg-neutral-100 border border-1 border-neutral-300 rounded-12 p-20 gap-16 w-full shadow-sm relative">
		<div class="flex items-center justify-between gap-12">
			<span class="text-14 font-medium text-neutral-600 truncle-lines-1">
				{{ card.title }}
			</span>

			<div v-if="card.icon" class="flex items-center justify-center p-8 rounded-8 bg-neutral-300 text-neutral-700">
				<component
					:is="iconsMap[card.icon]"
					class="w-24 h-24"
				/>
			</div>
		</div>

		<div class="text-24 lg:text-36 font-semibold text-neutral-950 leading-none tracking-tight">
			<slot name="value" v-bind="{ value: card.value }">{{ card.value }}</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconArrowsMoreUpRounded from "@/assets/icons/arrows-more-up-rounded.svg";
import IconCardTravelOutlineRounded from "@/assets/icons/card-travel-outline-rounded.svg";
import IconMoneyBagOutlineRounded from "@/assets/icons/money-bag-outline-rounded.svg";

const { card } = defineProps<{
	card: TStatisticsCard;
}>();

const iconsMap: Record<string, string> = {
	"arrows-more-up-rounded": IconArrowsMoreUpRounded,
	"card-travel-outline-rounded": IconCardTravelOutlineRounded,
	"money-bag-outline-rounded": IconMoneyBagOutlineRounded,
};
</script>
