<template>
	<div class="flex flex-col justify-between p-20 rounded-16 border border-neutral-300 bg-neutral-200/80 gap-20">
		<div class="flex items-start justify-between gap-12">
			<div class="flex flex-col gap-4 min-w-0">
				<span class="text-11 uppercase tracking-wider text-neutral-600 font-semibold">{{ card.exchangeName }}</span>
				<h3 class="text-16 lg:text-18 font-medium text-neutral-950 truncate" :title="card.strategy.name">{{ card.strategy.name }}</h3>
			</div>
			<div
				class="flex items-center gap-6 px-8 py-4 rounded-full text-11 font-medium border shrink-0"
				:class="[
					card.activate && 'bg-tertiary-200/60 text-tertiary-700 border-tertiary-400/50',
					!card.activate && 'bg-neutral-300/50 text-neutral-600 border-neutral-400/50'
				]"
			>
				<span class="w-6 h-6 rounded-full" :class="[card.activate && 'bg-tertiary-500', !card.activate && 'bg-neutral-600']" />
				{{ activeLabel }}
			</div>
		</div>
		<div class="grid grid-cols-2 gap-y-14 gap-x-16 py-14 border-y border-neutral-400/80">
			<div v-for="(item, idx) in info" :key="idx" class="flex flex-col gap-2">
				<span class="text-11 text-neutral-600">{{ item.label }}</span>
				<span class="text-15 tracking-tight tabular-nums" :class="item.valueClasses || 'text-neutral-900'">{{ item.value }}</span>
			</div>
		</div>
		<div class="flex items-center justify-between gap-12">
			<div class="flex items-center gap-6 overflow-x-auto no-scrollbar max-w-[80%]">
				<span
					v-for="(s, idx) in card.allowedSymbols"
					:key="idx"
					class="px-6 py-2 text-11 font-medium text-neutral-800 bg-neutral-300/70 rounded-6 whitespace-nowrap"
					:title="s"
				>{{ s }}</span>
			</div>
			<Tooltip :disabled="!isDesktop">
				<template #trigger>
					<NuxtLink :to="{ name: 'edit-config', params: { id: card.id } }" class="text-neutral-600">
						<IconEdit class="w-18 h-18" />
					</NuxtLink>
				</template>
				<template #content>Редактировать конфиг</template>
			</Tooltip>
		</div>
	</div>
</template>
<script setup lang="ts">
import Tooltip from "@/components/molecules/common/Tooltip.vue";
import IconEdit from "@/assets/icons/edit-outline-rounded.svg";

const { card } = defineProps<{ card: ConfigResponse; }>();

const isDesktop = useMediaQuery("(min-width: 1024px)");

const activeLabel = computed(() => (card.activate ? "Активен" : "Остановлен"));

const info = computed(() => [
	{
		label: "Маржа",
		value: card.margin,
	},
	{
		label: "Макс. плечо",
		value: `${card.maxLeverage}x`,
		valueClasses: "text-primary-700",
	},
	{
		label: "Дневная цель",
		value: "+" + formatNumberSign(formatNum(card.dailyGoalPercent / 100, { style: "percent" })),
		valueClasses: "text-tertiary-600",
	},
	{
		label: "Макс. убыток",
		value: formatNum(-card.maxLossPercent / 100, { style: "percent" }),
		valueClasses: "text-secondary-600",
	},
]);
</script>
