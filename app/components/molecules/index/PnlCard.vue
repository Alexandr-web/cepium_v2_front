<template>
	<div class="flex flex-col justify-between gap-32 rounded-8 bg-neutral-100/80 border-solid border border-white/5 p-16">
		<div class="flex items-center justify-between">
			<h3 class="text-12 lg:text-16 uppercase">24ч pnl</h3>
			<IconMoneyBagOutlineRounded class="w-22 lg:w-26 h-18 lg:h-22 text-primary-800" />
		</div>
		<div class="flex flex-col gap-8">
			<span
				class="text-18 font-semibold lg:text-36"
				:class="[
					dashboardStore.data.pnl24h > 0 && 'text-tertiary-800',
					dashboardStore.data.pnl24h < 0 && 'text-secondary-500',
				]"
			>{{ formattedValue }}</span>
			<ProgressLine :max="dashboardStore.data.dailyGoalPNL" :value="dashboardStore.data.pnl24h">
				<template #footer="{ percent }">
					<div class="flex justify-between items-center text-11 lg:text-14 text-white/50 font-medium">
						<p>Дневная цель: <span>{{ dailyGoalPNL }}</span></p>
						<p>{{ formatNum(percent, { style: "percent" }) }}</p>
					</div>
				</template>
			</ProgressLine>
		</div>
	</div>
</template>
<script setup lang="ts">
import ProgressLine from "@/components/atoms/ProgressLine.vue";
import IconMoneyBagOutlineRounded from "@/assets/icons/money-bag-outline-rounded.svg";
import { useDashboardStore } from "@/store/useDashboardStore";

const dashboardStore = useDashboardStore();

const dailyGoalPNL = computed(() => formatNum(dashboardStore.data.dailyGoalPNL, { currency: "USD", style: "currency" }));
const formattedValue = computed(() => formatNum(dashboardStore.data.pnl24h, { currency: "USD", style: "currency" }));
</script>
