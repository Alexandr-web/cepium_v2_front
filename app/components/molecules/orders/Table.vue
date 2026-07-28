<template>
	<!-- @vue-generic {TOrder}-->
	<MTable
		class="hidden lg:flex"
		:columns="columns"
		:data="orders"
	>
		<template #cell-index="{ index }">
			{{ formatNum(index + 1, { padZero: true }) }}
		</template>
		<template #cell-symbol="{ row }">
			<span class="font-bold">{{ row.symbol }}</span>
		</template>
		<template #cell-direction="{ row }">
			<span
				class="p-10 rounded-8 font-medium"
				:class="[
					row.direction === 'BUY' && 'text-tertiary-600 bg-tertiary-400/20',
					row.direction === 'SELL' && 'text-secondary-500 bg-secondary-400/20'
				]"
			>{{ row.direction }}</span>
		</template>
		<template #cell-amount="{ row }">
			{{ formatNum(row.amount, { padZero: true }) }}
		</template>
		<template #cell-pnl="{ row }">
			<span
				class="font-medium"
				:class="[
					(row.pnl ?? 0) > 0 && 'text-tertiary-600',
					(row.pnl ?? 0) < 0 && 'text-secondary-500'
				]"
			>{{ formatNum(row.pnl ?? "", { currency: "USD", style: "currency", defaultValue: "-" }) }}</span>
		</template>
		<template #cell-enterPrice="{ row }">
			<span class="text-primary-600">{{ formatNum(row.enterPrice, { currency: "USD", style: "currency" }) }}</span>
		</template>
		<template #cell-status="{ row }">
			<span
				:class="[
					row.status === 'open' && 'text-tertiary-600',
					row.status === 'close' && 'text-secondary-500'
				]"
			>{{ row.status }}</span>
		</template>
		<template #cell-time="{ row }">
			<span class="opacity-80">{{ formatIsoToPrettyStr(row.time) }}</span>
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
	},
	{
		key: "amount",
		label: "Кол-во",
	},
	{
		key: "enterPrice",
		label: "Цена входа",
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
	},
]);
</script>
