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
		<template #cell-side="{ value }">
			<span
				class="p-10 rounded-8 font-medium"
				:class="[
					value === 'long' && 'text-tertiary-600 bg-tertiary-400/20',
					value === 'short' && 'text-secondary-500 bg-secondary-400/20'
				]"
			>{{ value }}</span>
		</template>
		<template #cell-realizedPnl="{ row, value }">
			<span
				class="font-medium"
				:class="[
					(row.realizedPnl ?? 0) > 0 && 'text-tertiary-600',
					(row.realizedPnl ?? 0) < 0 && 'text-secondary-500'
				]"
			>{{ value }}</span>
		</template>
		<template #cell-entryPrice="{ value }">
			<span class="text-primary-600">{{ value }}</span>
		</template>
		<template #cell-createdAt="{ value }">
			<span class="opacity-80">{{ value }}</span>
		</template>
	</MTable>
</template>
<script setup lang="ts">
import MTable from "@/components/molecules/common/MTable.vue";
import { formatTimeAgo } from "@vueuse/core";

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
		key: "side",
		label: "Направление",
	},
	{
		key: "realizedPnl",
		label: "Профит",
		normalizer: (v) => formatNum(Number(v), { currency: "USD", style: "currency", defaultValue: "-" }),
	},
	{
		key: "size",
		label: "Кол-во",
		normalizer: (v) => formatNum(Number(v), { padZero: true }),
	},
	{
		key: "entryPrice",
		label: "Цена входа",
		normalizer: (v) => formatNum(Number(v), { currency: "USD", style: "currency" }),
	},
	{
		key: "createdAt",
		label: "Время создания",
		normalizer: (v) => formatTimeAgo(new Date(String(v)), { messages: RU_TIME_MESSAGES }),
	},
] as const);
</script>
