<template>
	<div class="flex flex-col justify-between gap-32 rounded-8 bg-neutral-100/80 border-solid border border-white/5 p-16">
		<div class="flex items-center justify-between">
			<h3 class="text-12 lg:text-16 uppercase">Активные позиции</h3>
			<IconShelfPositionSharp class="w-22 lg:w-26 h-18 lg:h-22 text-primary-800" />
		</div>
		<div class="flex flex-col gap-8">
			<span class="text-18 font-semibold lg:text-36">{{ formattedValue }}</span>
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
		</div>
	</div>
</template>
<script setup lang="ts">
import IconShelfPositionSharp from "@/assets/icons/shelf-position-sharp.svg";
import { useDashboardStore } from "@/store/useDashboardStore";

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

const formattedValue = computed(() => formatNum(dashboardStore.data.activePositionsCount, { padZero: true }));
</script>
