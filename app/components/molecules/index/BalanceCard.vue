<template>
	<div class="flex flex-col justify-between gap-32 rounded-8 bg-neutral-100/80 border-solid border border-white/5 p-16">
		<div class="flex items-center justify-between">
			<h3 class="text-12 lg:text-16 uppercase">Баланс</h3>
			<IconArrowsMoreUpRounded class="w-22 lg:w-26 h-18 lg:h-22 text-primary-800" />
		</div>
		<div class="flex flex-col gap-8">
			<span class="text-18 font-semibold lg:text-48">{{ formattedValue }}</span>
			<p
				:class="[
					dashboardStore.data.balanceDailyChangePercent > 0 && 'text-tertiary-800',
					dashboardStore.data.balanceDailyChangePercent < 0 && 'text-secondary-600',
				]">
				{{ dailyBalancePercentage }} за сегодня
			</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import IconArrowsMoreUpRounded from "@/assets/icons/arrows-more-up-rounded.svg";
import { useDashboardStore } from "@/store/useDashboardStore";

const dashboardStore = useDashboardStore();

const dailyBalancePercentage = computed(() => formatNum(dashboardStore.data.balanceDailyChangePercent, { style: "percent" }));
const formattedValue = computed(() => formatNum(dashboardStore.data.balance, { currency: "USD", style: "currency" }));
</script>
