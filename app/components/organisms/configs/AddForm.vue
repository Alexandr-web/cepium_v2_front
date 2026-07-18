<template>
	<section class="flex flex-col gap-12">
		<h2 class="text-20 font-semibold">Добавление конфига</h2>
		<!-- @vue-generic {TExchangeData}-->
		<GeneralForm
			:fields="fields"
			:normalized-data="normalizedData"
			@send="validateFields"
		/>
	</section>
</template>
<script setup lang="ts">
import * as z from "zod";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import ASelect from "@/components/atoms/ASelect.vue";
import AInput from "@/components/atoms/AInput.vue";
import { useStrategy } from "@/composables/api/useStrategies";

const { data: strategies, isPending: isPendingStrategies, suspense } = useStrategy();

await suspense();

const strategiesList = computed<TSelectItem[]>(() =>
	strategies.value?.data.map((s) => ({ label: s.name, value: s.id })) ?? []
);

const MARGIN_MODE_LIST: TSelectItem[] = [
	{ label: "Изолированная", value: "isolated" },
	{ label: "Кросс", value: "cross" },
];

const EXCHANGE_LIST: TSelectItem[] = [
	{ label: "Bybit", value: "1" },
	{ label: "OKX", value: "2" },
	{ label: "Binance", value: "3" },
];

const fields = ref<TGeneralFormField[]>([
	{
		name: "exchange",
		value: "",
		check: z.string().min(1),
		error: "",
		label: "Биржа",
		placeholder: "Выберите биржу",
		component: markRaw(ASelect),
		items: EXCHANGE_LIST,
	},
	{
		name: "margin",
		value: "",
		check: z.string().min(1),
		error: "",
		label: "Маржа",
		placeholder: "Выберите режим маржи",
		component: markRaw(ASelect),
		items: MARGIN_MODE_LIST,
	},
	{
		name: "strategyId",
		value: "",
		check: z.string().min(1),
		error: "",
		label: "Стратегия",
		placeholder: "Выберите стратегию",
		component: markRaw(ASelect),
		items: strategiesList.value,
		disabled: isPendingStrategies.value,
	},
	{
		name: "maxLeverage",
		value: "1",
		check: z.number().min(1),
		error: "",
		label: "Максимальное плечо",
		placeholder: "Укажите максимальное плечо",
		component: markRaw(AInput),
	},
	{
		name: "maxLossPercent",
		value: "1",
		check: z.number().min(1),
		error: "",
		label: "Максимальный процент убытка",
		placeholder: "Укажите максимальный процент убытка",
		component: markRaw(AInput),
	},
	{
		name: "dailyGoalPercent",
		value: "1",
		check: z.number().min(1),
		error: "",
		label: "Процент выполнения дневной цели",
		placeholder: "Укажите процент выполнения дневной цели",
		component: markRaw(AInput),
	},
	{
		name: "maxPositionSize",
		value: "1",
		check: z.number().min(1),
		error: "",
		label: "Максимальное количество активных позиций",
		placeholder: "Укажите максимальное количество активных позиций",
		component: markRaw(AInput),
	},
]);

const { validateFields } = useForm(fields);

const normalizedData = (): TExchangeData => ({
	margin: "",
	allowedSymbols: [], // нужен отдельный компонент (search list)
	maxLeverage: 0,
	maxLossPercent: 0, // нужен отдельный компонент (slider)
	strategyId: "0",
	dailyGoalPercent: 0, // нужен отдельный компонент (slider)
	maxPositionSize: 0,
	demoTrading: false, // нужен отдельный компонент (checkbox)
	activate: false, // нужен отдельный компонент (checkbox)
});
</script>
