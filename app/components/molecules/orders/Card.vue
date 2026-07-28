<template>
	<div class="flex flex-col gap-16 border-1 border-solid border-white/5 bg-primary-100 p-16 rounded-8">
		<div class="flex justify-between gap-10 border-b-1 border-b-solid border-b-white/10 pb-16">
			<div class="flex flex-col items-start">
				<div class="flex items-center gap-10">
					<span
						class="rounded-2 inline-block uppercase py-2 px-8 text-10 font-bold"
						:class="[
							card.direction === 'BUY' && 'bg-tertiary-400/20 text-tertiary-700',
							card.direction === 'SELL' && 'bg-secondary-300/20 text-secondary-500',
						]"
					>{{ card.direction }}</span>
					<span class="font-bold text-neutral-800 uppercase text-18">{{ card.symbol }}</span>
				</div>
				<span class="font-medium text-neutral-600 text-12">{{ time }}</span>
			</div>
			<span
				class="uppercase font-medium text-10"
				:class="[
					card.status === 'open' && 'text-tertiary-600',
					card.status === 'close' && 'text-secondary-500',
				]"
			>{{ card.status }}</span>
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
						(item.id === 'pnl' && (card.pnl ?? 0) >= 0) && 'text-tertiary-600',
						(item.id === 'pnl' && (card.pnl ?? 0) < 0) && 'text-secondary-500',
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

const time = computed(() => formatIsoToPrettyStr(card.time));
const enterPrice = computed(() => formatNum(card.enterPrice, { currency: "USD", style: "currency" }));
const amount = computed(() => formatNum(card.amount, { padZero: true }));
const pnl = computed(() => {
	if (!card.pnl) return "0";

	return formatNum(card.pnl, { currency: "USD", style: "currency" });
});

const bottomInfo = computed(() =>
	[
		{ label: "Цена входа", id: "price", value: enterPrice.value },
		{ label: "Pnl", id: "pnl", value: pnl.value, hide: !card.pnl },
		{ label: "Кол-во", id: "amount", value: amount },
	].filter(({ hide }) => !hide)
);
</script>
