<template>
	<!-- @vue-generic {Coin}-->
	<MTable
		class="hidden lg:flex"
		title="Популярные монеты"
		head-icon="material-symbols:card-travel-outline-rounded"
		:columns="columns"
		:data="coins"
	>
		<template #cell-index="{ index }">
			{{ formatNum(index + 1, { padZero: true }) }}
		</template>
		<template #cell-currentPrice="{ row }">
			<div class="flex flex-col gap-5">
				<span class="text-14 text-neutral-800">{{ row.prettyCurrentPrice }}</span>
				<span
					class="text-12"
					:class="[
						row.change24hprct >= 0 && 'text-tertiary-600',
						row.change24hprct < 0 && 'text-secondary-600',
					]"
				>{{ row.prettyChange24hprct }}</span>
			</div>
		</template>
	</MTable>
</template>
<script setup lang="ts">
import type Coin from "@/models/Coin";
import MTable from "@/components/molecules/common/MTable.vue";

defineProps<{ coins: Coin[] }>();

const columns = computed<TTableColumn<Coin>[]>(() => [
	{
		key: "index",
		label: "№",
	},
	{
		key: "fullSymbol",
		label: "Монета",
	},
	{
		key: "currentPrice",
		label: "Текущая цена",
	},
	{
		key: "prettyVolume24h",
		label: "Объем за 24 часа",
	},
]);
</script>
