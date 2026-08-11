<template>
	<div class="flex flex-col p-16 lg:p-24 rounded-12 border border-solid border-neutral-400 bg-primary-100 gap-16">
		<div class="flex justify-between gap-10">
			<div class="flex flex-col gap-3 min-w-0">
				<span
					class="text-12 lg:text-20 font-medium lg:font-bold truncate text-neutral-700"
					:title="card.strategy.name"
				>{{ card.strategy.name }}</span>
			</div>
			<div
				class="text-10 lg:text-12 font-bold uppercase whitespace-nowrap"
				:class="[
					card.activate && 'text-tertiary-500',
					!card.activate && 'text-secondary-500',
				]"
			>{{ activeLabel }}</div>
		</div>
		<div class="grid grid-cols-2 gap-12 rounded-8 bg-primary-200 p-12">
			<div v-for="(item, idx) in info" :key="idx" class="flex flex-col">
				<span class="text-10 lg:text-12 uppercase text-neutral-800">{{ item.label }}</span>
				<span class="text-14 lg:text-16 text-neutral-900 font-medium" :class="item.valueClasses">{{ item.value }}</span>
			</div>
		</div>
		<div class="scroll-block overflow-auto max-h-100">
			<div class="flex flex-wrap gap-8">
				<span
					v-for="(s, idx) in card.allowedSymbols"
					:key="idx"
					class="inline-block py-4 px-8 text-neutral-800 text-10 lg:text-12 uppercase font-bold truncate bg-neutral-400 rounded-4 max-w-150"
					:title="s"
				>{{ s }}</span>
			</div>
		</div>
		<div class="flex gap-12 justify-between items-center border-t-1 border-t-solid border-t-neutral-200 pt-16">
			<NuxtLink
				class="group flex items-center gap-10 rounded-8 p-8 bg-black/80 transition hover:bg-black"
				:to="{ name: 'edit-config', params: { id: card.id } }"
			>
				<span class="text-12 lg:text-14 text-white/90 transition group-hover:text-white">Редактировать</span>
				<IconEdit class="w-15 lg:w-20 h-15 lg:h-20 transition group-hover:text-neutral-800 text-neutral-700" />
			</NuxtLink>
			<span class="uppercase text-14 text-neutral-600">{{ card.exchangeName }}</span>
		</div>
	</div>
</template>
<script setup lang="ts">
import IconEdit from "@/assets/icons/edit-outline-rounded.svg";

const { card } = defineProps<{ card: TConfigResponse; }>();

const activeLabel = computed(() => card.activate ? "Активно" : "Не активно");

const info = computed(() => [
	{
		label: "Маржа",
		value: card.margin,
	},
	{
		label: "Макс плечо",
		value: card.maxLeverage + "x",
		valueClasses: "text-primary-800",
	},
	{
		label: "Дневная цель",
		value: "+" + formatNum(card.dailyGoalPercent / 100, { style: "percent" }),
		valueClasses: "text-tertiary-800",
	},
	{
		label: "Макс убыток",
		value: formatNum(-card.maxLossPercent / 100, { style: "percent" }),
		valueClasses: "text-secondary-500",
	},
]);
</script>
