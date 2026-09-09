<template>
	<!-- @vue-generic {Trade} -->
	<MTable
		class="hidden lg:flex"
		head-icon="view-list"
		title="Активные позиции"
		:data="tradeStore.trades"
		:columns="columns"
	>
		<template #head-controls>
			<div v-if="tradeStore.trades.length" class="flex items-center gap-10">
				<Tooltip placement="left">
					<template #trigger>
						<AButton
							class="py-4 px-12 rounded-4 text-14"
							mode="remove-border"
							:disabled="disabled"
							@click="emits('removeAll')"
						>Закрыть все</AButton>
					</template>
					<template #content>
						<p class="font-light">
							Закрыть все позиции<br>Общий профит:&nbsp;
							<span
								:class="[
									totalProfit >= 0 && 'text-tertiary-600',
									totalProfit < 0 && 'text-secondary-600',
								]"
							>{{ prettyTotalProfit }}</span>
						</p>
					</template>
				</Tooltip>
			</div>
		</template>
		<template #cell-symbol="{ row }">
			<div class="flex items-center gap-6">
				<AImage
					:src="getUrlCoinIcon(row.symbol)"
					:preset="ImagePreset.COIN"
					:is-nuxt-img="false"
					loading="lazy"
					:alt="row.symbol"
				/>
				<span
					class="text-14 text-white font-bold cursor-pointer hover:underline"
					@click="emits('selectSymbol', row.symbol)"
				>{{ row.symbol }}</span>
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
			<Tooltip placement="left">
				<template #trigger>
					<AButton
						class="rounded-4 px-12 py-6 text-14 w-full"
						mode="remove-fill"
						:disabled="disabled"
						@click="emits('removeOne', row)"
					>Закрыть</AButton>
				</template>
				<template #content>
					<p class="text-14 font-light">
						Закрыть позицию <span class="uppercase font-medium">{{ row.direction }} {{ row.shortSymbol }}</span><br>
						Профит:&nbsp;
						<span
							:class="[
								row.pnl >= 0 && 'text-tertiary-600',
								row.pnl < 0 && 'text-secondary-600',
							]"
						>{{ row.prettyPnl }}</span>
					</p>
				</template>
			</Tooltip>
		</template>
	</MTable>
</template>
<script setup lang="ts">
import type Trade from "@/models/Trade";
import Tooltip from "@/components/molecules/common/Tooltip.vue";
import AButton from "@/components/atoms/AButton.vue";
import AImage from "@/components/atoms/AImage.vue";
import MTable from "@/components/molecules/common/MTable.vue";
import { useTradeStore } from "@/store/useTradeStore";

withDefaults(
	defineProps<{
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

const tradeStore = useTradeStore();

const emits = defineEmits(["removeOne", "removeAll", "selectSymbol"]);

const columns = computed<TableColumn<Trade>[]>(() => [
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

const totalProfit = computed(() => tradeStore.trades.reduce<number>((sum, trade) => sum += trade.pnl, 0));
const prettyTotalProfit = computed(() => formatNum(totalProfit.value, { currency: "USD", style: "currency" }));
</script>
