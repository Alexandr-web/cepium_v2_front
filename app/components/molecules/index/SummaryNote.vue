<template>
	<div
		:class="[
			card.type === 'balance' && 'text-11 lg:text-16 text-tertiary-800 font-medium',
			card.type === 'positions' && 'flex'
		]"
	>
		<template v-if="card.type === 'balance'">{{ dailyBalancePercentage }} за сегодня</template>
		<template v-if="card.type === 'positions'">
			<ul class="flex gap-16">
				<li
					v-for="(item, idx) in margin"
					:key="idx"
					class="flex flex-col text-11 lg:text-14 font-medium"
					:class="[
						idx !== 0 && 'pl-16 border-l-1 border-solid border-l-white/5'
					]"
				>
					<span class="text-white/80">{{ item.title }}</span>
					<span class="text-primary-800">{{ item.value }}</span>
				</li>
			</ul>
		</template>
		<template v-if="card.type === 'pnl'">
			<ProgressLine :max="dailyGoal" :value="currentPNL">
				<template #footer="{ percent }">
					<div class="flex justify-between items-center text-11 lg:text-14 text-white/50 font-medium">
						<p>Дневная цель: <span>{{ currentPNLFormat }}</span></p>
						<p>{{ percent }}</p>
					</div>
				</template>
			</ProgressLine>
		</template>
	</div>
</template>
<script setup lang="ts">
import type { TIndexCardSummary } from "@/types/components";
import ProgressLine from "@/components/atoms/ProgressLine.vue";

defineProps<{
	card: TIndexCardSummary;
}>();

const margin = computed(() => [
	{
		title: "Маржи используется",
		value: formatNum(32000, { currency: "USD", style: "currency" }),
	},
	{
		title: "Маржи доступно",
		value: formatNum(110000, { currency: "USD", style: "currency" }),
	},
]);

const dailyBalancePercentage = computed(() => formatNum(0.042, { style: "percent" }));
const dailyGoal = 4300;
const currentPNL = 3120;
const currentPNLFormat = computed(() => formatNum(currentPNL, { currency: "USD", style: "currency" }));
</script>
