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
import SearchList from "@/components/molecules/common/SearchList.vue";
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
	{ label: "Bybit", value: "bybit" },
	{ label: "OKX", value: "okx" },
	{ label: "Binance", value: "binance" },
];

const choosedExchange = ref<string|null>(null);

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
		name: "allowedSymbols",
		value: [],
		check: z.array(z.string()).min(1),
		error: "",
		disabled: !choosedExchange.value,
		label: "Список отслеживаемых монет",
		placeholder: "Поиск отслеживаемых монет",
		component: markRaw(SearchList),
		// моковые данные
		search: async () => {
			return new Promise((res) => {
				setTimeout(() => {
					res([
						{ label: "btc/usdt", value: "btc" },
						{ label: "ton/usdt", value: "ton" },
						{ label: "sol/usdt", value: "sol" },
						{ label: "eth/usdt", value: "eth" },
					]);
				}, 5000);
			});
		},
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
	allowedSymbols: [],
	maxLeverage: 0,
	maxLossPercent: 0, // нужен отдельный компонент (slider)
	strategyId: "0",
	dailyGoalPercent: 0, // нужен отдельный компонент (slider)
	maxPositionSize: 0,
	demoTrading: false, // нужен отдельный компонент (checkbox)
	activate: false, // нужен отдельный компонент (checkbox)
});

// обновляем disabled у "allowedSymbols" при выборе биржи
const exchangeFieldsValue = computed(() => String(fields.value.find(({ name }) => name === "exchange")?.value));
const allowedSymbolsField = computed(() => fields.value.find(({ name }) => name === "allowedSymbols"));

watch(exchangeFieldsValue, (v) => {
	choosedExchange.value = v;
	if (allowedSymbolsField.value) allowedSymbolsField.value.disabled = !v;
});
</script>
