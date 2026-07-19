<template>
	<section class="flex flex-col gap-12 lg:max-w-1200 w-full lg:mx-auto">
		<h2 class="text-20 font-semibold">Добавление конфига</h2>
		<!-- @vue-generic {TExchangeData}-->
		<GeneralForm
			:fields="fields"
			:normalized-data="normalizedData"
			mode="grid"
			fields-list-classes="lg:grid-cols-6"
			@send="validateFields"
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
import { useStrategy } from "@/composables/api/useStrategies";
import ACheckbox from "@/components/atoms/ACheckbox.vue";

const exchangeStore = useExchangeStore();

const { data: strategies, isPending: isPendingStrategies, suspense } = useStrategy();

await suspense();

const exchangesList = computed<TSelectItem[]>(() => exchangeStore.getAllExchange().map((item) => ({ label: item.name, value: item.id })));
const strategiesList = computed<TSelectItem[]>(() =>
	strategies.value?.data.map((s) => ({ label: s.name, value: s.id })) ?? []
);

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
		disabled: isPendingStrategies.value,
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

const normalizedData = (): TExchangeData => ({
	margin: "",
	allowedSymbols: [],
	maxLeverage: 0,
	maxLossPercent: 0,
	strategyId: "0",
	dailyGoalPercent: 0,
	maxPositionSize: 0,
	demoTrading: false,
	activate: false,
});

// обновляем disabled у "allowedSymbols" при выборе биржи
const exchangeFieldsValue = computed(() => String(fields.value.find(({ name }) => name === "exchange")?.value));
const allowedSymbolsField = computed(() => fields.value.find(({ name }) => name === "allowedSymbols"));

watch(exchangeFieldsValue, (v) => {
	choosedExchange.value = v;
	if (allowedSymbolsField.value) allowedSymbolsField.value.disabled = !v;
});
</script>
