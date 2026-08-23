<template>
	<div class="flex flex-col gap-16 border border-solid border-white/5 bg-primary-100 p-16 rounded-8">
		<div class="flex justify-between gap-10 border-b-1 border-b-solid border-b-white/10 pb-16">
			<div class="flex flex-col items-start">
				<div class="flex items-center gap-10">
					<span
						class="rounded-2 inline-block uppercase py-2 px-8 text-10 font-bold"
						:class="[
							card.side === 'long' && 'bg-tertiary-400/20 text-tertiary-700',
							card.side === 'short' && 'bg-secondary-300/20 text-secondary-500',
						]"
					>{{ card.side }}</span>
					<span class="font-bold text-neutral-800 uppercase text-18">{{ card.symbol }}</span>
				</div>
				<span class="font-medium text-neutral-600 text-12">{{ time }}</span>
			</div>
		</div>
		<div
			class="grid gap-10"
			:class="[
				bottomInfo.length === 3 && 'grid-cols-3',
				bottomInfo.length === 2 && 'grid-cols-2'
			]"
		>
			<div v-for="item in bottomInfo" :key="item.id" class="flex items-center flex-col">
				<div class="text-12 text-neutral-700 font-medium">{{ item.label }}</div>
				<span
					class="text-neutral-950 text-14"
					:class="[
						(item.id === 'pnl' && (card.realizedPnl ?? 0) >= 0) && 'text-tertiary-600',
						(item.id === 'pnl' && (card.realizedPnl ?? 0) < 0) && 'text-secondary-500',
					]"
				>{{ item.value }}</span>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
const { card } = defineProps<{
	card: TOrder;
}>();

const time = useTimeAgo(String(card.createdAt), { messages: RU_TIME_MESSAGES });
const enterPrice = computed(() => formatNum(Number(card.entryPrice), { currency: "USD", style: "currency", defaultValue: "-" }));
const amount = computed(() => formatNum(card.size, { padZero: true }));
const pnl = computed(() => {
	if (!card.realizedPnl) return "0";
	return formatNum(card.realizedPnl, { currency: "USD", style: "currency" });
});

const bottomInfo = computed(() =>
	[
		{ label: "Цена входа", id: "price", value: enterPrice.value },
		{ label: "Pnl", id: "pnl", value: pnl.value, hide: !card.realizedPnl },
		{ label: "Кол-во", id: "amount", value: amount.value },
	].filter(({ hide }) => !hide)
);
</script>
