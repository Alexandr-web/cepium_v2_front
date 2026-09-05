<template>
	<!-- @vue-generic {Trade} -->
	<MTable
		class="hidden lg:flex"
		head-icon="view-list"
		title="Активные позиции"
		:data="trades"
		:columns="columns"
	>
		<template #head-controls>
			<div v-if="trades.length" class="flex items-center gap-10">
				<AButton
					class="py-4 px-12 rounded-4 text-14"
					mode="remove-border"
					:disabled="disabled"
					@click="emits('removeAll')"
				>Закрыть все</AButton>
			</div>
		</template>
		<template #cell-symbol="{ row }">
			<span class="text-14 text-white font-bold">{{ row.symbol }}</span>
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
		<template #cell-prettyLiquidationPrice="{ row }">
			<p class="text-primary-500">{{ row.prettyLiquidationPrice }}</p>
		</template>
		<template #cell-prettyStopLossPrice="{ row }">
			<p :class="[row.prettyStopLossPrice !== '-' && 'text-secondary-500']">{{ row.prettyStopLossPrice }}</p>
		</template>
		<template #cell-prettyTakeProfitPrice="{ row }">
			<p :class="[row.prettyTakeProfitPrice !== '-' && 'text-tertiary-500']">{{ row.prettyTakeProfitPrice }}</p>
		</template>
		<template #cell-pnl="{ row }">
			<p
				class="font-bold"
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
				:disabled="disabled"
				@click="emits('removeOne', row)"
			>Закрыть</AButton>
		</template>
	</MTable>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import AButton from "@/components/atoms/AButton.vue";
import MTable from "@/components/molecules/common/MTable.vue";

withDefaults(
	defineProps<{
		trades: Trade[];
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

const emits = defineEmits(["removeOne", "removeAll"]);

const columns = computed<TTableColumn<Trade>[]>(() => [
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
		key: "prettyLiquidationPrice",
		label: "Цена ликвидации",
	},
	{
		key: "prettyStopLossPrice",
		label: "Стоп",
	},
	{
		key: "prettyTakeProfitPrice",
		label: "Тейк",
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
		key: "prettyCreatedAt",
		label: "Время открытия",
	},
	{
		key: "controls",
		label: "Действия",
	},
] as const);
</script>
