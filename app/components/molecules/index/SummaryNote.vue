<template>
	<div
		:class="[
			card.type === 'balance' && 'text-11 lg:text-16 font-medium',
			card.type === 'positions' && 'flex'
		]"
	>
		<template v-if="card.type === 'balance'">
			<p
				:class="[
					dashboardStore.data.balanceDailyChangePercent >= 0 && 'text-tertiary-800',
					dashboardStore.data.balanceDailyChangePercent < 0 && 'text-secondary-600',
				]">
				{{ dailyBalancePercentage }} за сегодня
			</p>
		</template>
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
			<ProgressLine :max="dashboardStore.data.dailyGoalPNL" :value="dashboardStore.data.pnl24h">
				<template #footer="{ percent }">
					<div class="flex justify-between items-center text-11 lg:text-14 text-white/50 font-medium">
						<p>Дневная цель: <span>{{ dailyGoalPNL }}</span></p>
						<p>{{ percent }}</p>
					</div>
				</template>
			</ProgressLine>
		</template>
	</div>
</template>
<script setup lang="ts">
import type { TIndexCardSummary } from "@/types/components";
import { useDashboardStore } from "@/store/useDashboardStore";
import ProgressLine from "@/components/atoms/ProgressLine.vue";

defineProps<{
	card: TIndexCardSummary;
}>();

const dashboardStore = useDashboardStore();

const margin = computed(() => [
	{
		title: "Маржи используется",
		value: formatNum(dashboardStore.data.usedMargin, { currency: "USD", style: "currency" }),
	},
	{
		title: "Маржи доступно",
		value: formatNum(dashboardStore.data.availableMargin, { currency: "USD", style: "currency" }),
	},
]);

const dailyBalancePercentage = computed(() => formatNum(dashboardStore.data.balanceDailyChangePercent, { style: "percent" }));
const dailyGoalPNL = computed(() => formatNum(dashboardStore.data.dailyGoalPNL, { currency: "USD", style: "currency" }));
</script>
