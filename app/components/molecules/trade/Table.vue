<template>
	<!-- @vue-generic {Trade} -->
	<MTable
		class="hidden lg:flex"
		head-icon="material-symbols:view-list"
		title="Активные позиции"
		:data="trades"
		:columns="columns"
	>
		<template #head-controls>
			<div class="flex items-center gap-10">
				<AButton class="rounded-4 px-12 py-6 text-14" mode="neutral-fill">Экспорт</AButton>
				<AButton class="py-4 px-12 rounded-4 text-14" mode="remove-border" @click="emits('click-by-remove-all')">Закрыть все</AButton>
			</div>
		</template>
		<template #cell-index="{ index }">{{ formatNum(index + 1, { padZero: true }) }}</template>
		<template #cell-symbol="{ row }">
			<div class="flex items-center gap-12">
				<div class="rounded-12 flex justify-center items-center bg-primary-300 text-primary-950 w-38 h-40 text-10 border-1 border-solid border-white/10">{{ row.symbol }}</div>
				<div class="flex flex-col">
					<span class="text-14 text-white font-bold">{{ row.fullSymbol }}</span>
					<span class="text-12 text-white/50 font-medium">{{ row.margin }}</span>
				</div>
			</div>
		</template>
		<template #cell-direction="{ row }">
			<div
				class="p-8 rounded-4 inline-flex items-center text-12 uppercase"
				:class="[
					row.direction === 'long' && 'bg-tertiary-200 text-tertiary-600',
					row.direction === 'short' && 'bg-secondary-200 text-secondary-600',
				]"
			>
				<p>{{ row.direction }} {{ row.prettyLeverage }}</p>
			</div>
		</template>
		<template #cell-pnl="{ row }">
			<p
				class="font-bold text-16"
				:class="[
					row.pnl >= 0 && 'text-tertiary-600',
					row.pnl < 0 && 'text-secondary-600',
				]"
			>{{ row.prettyPnl }}</p>
		</template>
		<template #cell-controls="{ row }">
			<AButton
				class="rounded-4 px-12 py-6 text-14 w-full"
				mode="remove-fill"
				@click="emits('click-by-remove', row)"
			>Закрыть</AButton>
		</template>
	</MTable>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import type { TTableColumn } from "@/types/components";
import AButton from "@/components/atoms/AButton.vue";
import MTable from "@/components/molecules/common/MTable.vue";

defineProps<{ trades: Trade[] }>();

const emits = defineEmits(["click-by-remove", "click-by-remove-all"]);

const columns = computed<TTableColumn<Trade>[]>(() => [
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
		key: "prettyEntryPrice",
		label: "Вход",
	},
	{
		key: "prettyCurrentPrice",
		label: "Текущая цена",
	},
	{
		key: "pnl",
		label: "PNL",
	},
	{
		key: "controls",
		label: "Действия",
	},
]);
</script>
