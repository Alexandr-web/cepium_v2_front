<template>
	<section class="flex flex-col gap-12 lg:max-w-1200 w-full lg:mx-auto">
		<h2 class="text-20 font-semibold">Добавление конфига</h2>
		<!-- @vue-generic {TExchangeData}-->
		<GeneralForm
			:fields="fields"
			:normalized-data="normalizedData"
			mode="grid"
			fields-list-classes="lg:grid-cols-6"
			@send="execute"
		>
			<template #content>
				<div class="flex flex-col-reverse lg:flex-row">
					<AError message="" />
					<AButton
						class="w-full lg:w-auto rounded-4 p-16 lg:px-24 lg:ml-auto"
						mode="primary-fill"
						type="submit"
					>
						Добавить
					</AButton>
				</div>
			</template>
		</GeneralForm>
	</section>
</template>
<script setup lang="ts">
import * as z from "zod";
import AButton from "@/components/atoms/AButton.vue";
import AError from "@/components/atoms/AError.vue";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import ASelect from "@/components/atoms/ASelect.vue";
import AInput from "@/components/atoms/AInput.vue";
import SearchList from "@/components/molecules/common/SearchList.vue";
import ASlider from "@/components/atoms/ASlider.vue";
import { useExchangeStore } from "@/store/useExchangeStore";
import ACheckbox from "@/components/atoms/ACheckbox.vue";

const { strategies, isPendingStrategy, isPendingExchanges } = defineProps<{
	strategies: TStrategyEntity[];
	isPendingStrategy: boolean;
	isPendingExchanges: boolean;
}>();

const router = useRouter();

const exchangeStore = useExchangeStore();

const exchangesList = computed<TSelectItem[]>(() => exchangeStore.getAllExchanges().map((item) => ({ label: item.name, value: item.id })));
const strategiesList = computed<TSelectItem[]>(() => strategies.map((s) => ({ label: s.name, value: s.id })) ?? []);

const MARGIN_MODE_LIST: TSelectItem[] = [
	{ label: "Изолированная", value: "isolated" },
	{ label: "Кросс", value: "cross" },
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
		items: exchangesList.value,
		disabled: isPendingExchanges,
		classes: "lg:col-span-2",
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
		classes: "lg:col-span-2",
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
		disabled: isPendingStrategy,
		classes: "lg:col-span-2",
	},
	{
		name: "maxLossPercent",
		value: 1,
		check: z.number().min(1),
		error: "",
		label: "Максимальный процент убытка",
		placeholder: "Укажите максимальный процент убытка",
		component: markRaw(ASlider),
		showTooltip: "focus",
		format: (v: number) => formatNum(v / 100, { style: "percent" }),
		classes: "lg:col-span-3",
	},
	{
		name: "dailyGoalPercent",
		value: 1,
		check: z.number().min(1),
		error: "",
		label: "Процент выполнения дневной цели",
		placeholder: "Укажите процент выполнения дневной цели",
		component: markRaw(ASlider),
		showTooltip: "focus",
		format: (v: number) => formatNum(v / 100, { style: "percent" }),
		classes: "lg:col-span-3",
	},
	{
		name: "maxLeverage",
		value: 1,
		check: z.number().min(1),
		error: "",
		label: "Максимальное плечо",
		placeholder: "Укажите максимальное плечо",
		component: markRaw(AInput),
		type: "number",
		classes: "lg:col-span-3",
	},
	{
		name: "maxPositionSize",
		value: 1,
		check: z.number().min(1),
		error: "",
		label: "Максимальное количество активных позиций",
		placeholder: "Укажите максимальное количество активных позиций",
		component: markRaw(AInput),
		type: "number",
		classes: "lg:col-span-3",
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
		classes: "lg:col-span-6",
		// моковые данные
		search: async () => {
			return new Promise((res) => {
				setTimeout(() => {
					res([
						{ label: "BTC/USDT:USDT", value: "BTC/USDT:USDT" },
						{ label: "TON/USDT:USDT", value: "TON/USDT:USDT" },
						{ label: "SOL/USDT:USDT", value: "SOL/USDT:USDT" },
						{ label: "ETH/USDT:USDT", value: "ETH/USDT:USDT" },
					]);
				}, 5000);
			});
		},
	},
	{
		name: "demoTrading",
		value: true,
		label: "Демо торговля",
		component: markRaw(ACheckbox),
		size: "big",
	},
	{
		name: "activate",
		value: true,
		label: "Активировать",
		component: markRaw(ACheckbox),
		size: "big",
	},
]);

const { validateFields } = useForm(fields);

const normalizedData = (): TExchangeData => {
	const allowedSymbols = fields.value.find(({ name }) => name === "allowedSymbols")?.value;

	return {
		margin: String(fields.value.find(({ name }) => name === "margin")?.value),
		allowedSymbols: Array.isArray(allowedSymbols) ? allowedSymbols : [],
		maxLeverage: Number(fields.value.find(({ name }) => name === "maxLeverage")?.value),
		maxLossPercent: Number(fields.value.find(({ name }) => name === "maxLossPercent")?.value),
		strategyId: String(fields.value.find(({ name }) => name === "strategyId")?.value),
		dailyGoalPercent: Number(fields.value.find(({ name }) => name === "dailyGoalPercent")?.value),
		maxPositionSize: Number(fields.value.find(({ name }) => name === "maxPositionSize")?.value),
		demoTrading: Boolean(fields.value.find(({ name }) => name === "demoTrading")?.value),
		activate: Boolean(fields.value.find(({ name }) => name === "activate")?.value),
	};
};

const execute = async (data: TExchangeData) => {
	if (!validateFields()) return;
	// TODO добавить бек
	console.log(data);
	router.push({ name: "configs" });
};

// обновляем disabled у "allowedSymbols" при выборе биржи
const exchangeFieldsValue = computed(() => String(fields.value.find(({ name }) => name === "exchange")?.value));
const allowedSymbolsField = computed(() => fields.value.find(({ name }) => name === "allowedSymbols"));

watch(exchangeFieldsValue, (v) => {
	choosedExchange.value = v;
	if (allowedSymbolsField.value) allowedSymbolsField.value.disabled = !v;
});
</script>
