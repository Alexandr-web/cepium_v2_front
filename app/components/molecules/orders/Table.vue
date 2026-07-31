<template>
	<!-- @vue-generic {TOrder}-->
	<MTable
		class="hidden lg:flex"
		:columns="columns"
		:data="orders"
	>
		<template #cell-symbol="{ value }">
			<span class="font-bold">{{ value }}</span>
		</template>
		<template #cell-direction="{ value }">
			<span
				class="p-10 rounded-8 font-medium"
				:class="[
					value === 'BUY' && 'text-tertiary-600 bg-tertiary-400/20',
					value === 'SELL' && 'text-secondary-500 bg-secondary-400/20'
				]"
			>{{ value }}</span>
		</template>
		<template #cell-pnl="{ row, value }">
			<span
				class="font-medium"
				:class="[
					(row.pnl ?? 0) > 0 && 'text-tertiary-600',
					(row.pnl ?? 0) < 0 && 'text-secondary-500'
				]"
			>{{ value }}</span>
		</template>
		<template #cell-enterPrice="{ value }">
			<span class="text-primary-600">{{ value }}</span>
		</template>
		<template #cell-status="{ value }">
			<span
				:class="[
					value === 'open' && 'text-tertiary-600',
					value === 'close' && 'text-secondary-500'
				]"
			>{{ value }}</span>
		</template>
		<template #cell-time="{ value }">
			<span class="opacity-80">{{ value }}</span>
		</template>
	</MTable>
</template>
<script setup lang="ts">
import MTable from "@/components/molecules/common/MTable.vue";

defineProps<{ orders: TOrder[] }>();

const columns = computed<TTableColumn<TOrder>[]>(() => [
	{
		key: "index",
		label: "№",
		normalizer: (v) => formatNum(Number(v) + 1,  { padZero: true }),
	},
	{
		key: "symbol",
		label: "Монета",
	},
	{
		key: "direction",
		label: "Направление",
	},
	{
		key: "pnl",
		label: "Профит",
		normalizer: (v) => formatNum(Number(v), { currency: "USD", style: "currency", defaultValue: "-" }),
	},
	{
		key: "amount",
		label: "Кол-во",
		normalizer: (v) => formatNum(Number(v), { padZero: true }),
	},
	{
		key: "enterPrice",
		label: "Цена входа",
		normalizer: (v) => formatNum(Number(v), { currency: "USD", style: "currency" }),
	},
	{
		key: "type",
		label: "Тип",
	},
	{
		key: "status",
		label: "Статус",
	},
	{
		key: "time",
		label: "Время создания",
		normalizer: (v) => formatIsoToPrettyStr(String(v)),
	},
] as const);
</script>
