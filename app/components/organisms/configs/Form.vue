<template>
	<section class="flex flex-col gap-12 lg:max-w-1200 w-full lg:mx-auto">
		<h2 class="text-20 lg:text-24 font-semibold">{{ title }}</h2>
		<!-- @vue-generic {TConfigData}-->
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
						:disabled="isPendingConfig"
					>
						{{ btnText }}
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
import { useMarketsSearch } from "@/composables/api/useExchanges";

const props = withDefaults(
	defineProps<{
		strategies: TStrategyEntity[];
		isPendingStrategy: boolean;
		isPendingExchanges: boolean;
		isPendingConfig: boolean;
		title: string;
		btnText: string;
		data?: TConfigByIdResponse["data"];
	}>(),
	{
		data: undefined,
	}
);

const { searchMarkets } = useMarketsSearch();

const emits = defineEmits(["execute"]);

const exchangeStore = useExchangeStore();

const strategiesList = computed<TSelectItem[]>(() => props.strategies.map((s) => ({ label: s.name, value: s.id })) ?? []);
const exchangesList = computed<TSelectItem[]>(() =>
	exchangeStore.getAllExchanges()
		.filter((item) => item.filled)
		.map((item) => ({ label: item.name, value: item.name }))
);

const MARGIN_MODE_LIST: TSelectItem[] = [
	{ label: "Изолированная", value: "isolated" },
	{ label: "Кросс", value: "cross" },
];

const choosedExchange = ref(props.data?.exchangeName || "");

const fields = ref<TGeneralFormField[]>([
	{
		name: "exchange",
		value: String(props.data?.exchangeName ?? ""),
		check: z.string().min(1),
		error: "",
		label: "Биржа",
		placeholder: "Выберите биржу",
		component: markRaw(ASelect),
		items: exchangesList.value,
		disabled: props.isPendingExchanges || !exchangesList.value.length,
		classes: "lg:col-span-2",
	},
	{
		name: "margin",
		value: String(props.data?.margin ?? ""),
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
		value: String(props.data?.strategy.id ?? ""),
		check: z.string().min(1),
		error: "",
		label: "Стратегия",
		placeholder: "Выберите стратегию",
		component: markRaw(ASelect),
		items: strategiesList.value,
		disabled: props.isPendingStrategy,
		classes: "lg:col-span-2",
	},
	{
		name: "maxLossPercent",
		value: Number(props.data?.maxLossPercent ?? 1),
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
		value: Number(props.data?.dailyGoalPercent ?? 1),
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
		value: Number(props.data?.maxLeverage ?? 1),
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
		value: Number(props.data?.maxPositionSize ?? 1),
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
		value: props.data?.allowedSymbols ?? [],
		check: z.array(z.string()).min(1),
		error: "",
		disabled: !choosedExchange.value,
		label: "Список отслеживаемых монет",
		placeholder: "Поиск отслеживаемых монет",
		component: markRaw(SearchList),
		classes: "lg:col-span-6",
		search: async (search: string): Promise<TSelectItem[]> => {
			const res = await searchMarkets(choosedExchange.value, search);
			return res.data.map((s) => ({ label: s.symbol, value: s.symbol })) ?? [];
		},
	},
	{
		name: "activate",
		value: props.data?.activate ?? true,
		label: "Активировать",
		component: markRaw(ACheckbox),
		size: "big",
	},
]);

const { validateFields } = useForm(fields);

const normalizedData = (): TConfigData => {
	const allowedSymbols = fields.value.find(({ name }) => name === "allowedSymbols")?.value;

	return {
		margin: String(fields.value.find(({ name }) => name === "margin")?.value),
		allowedSymbols: Array.isArray(allowedSymbols) ? allowedSymbols : [],
		maxLeverage: Number(fields.value.find(({ name }) => name === "maxLeverage")?.value),
		maxLossPercent: Number(fields.value.find(({ name }) => name === "maxLossPercent")?.value),
		strategyId: String(fields.value.find(({ name }) => name === "strategyId")?.value),
		dailyGoalPercent: Number(fields.value.find(({ name }) => name === "dailyGoalPercent")?.value),
		maxPositionSize: Number(fields.value.find(({ name }) => name === "maxPositionSize")?.value),
		activate: Boolean(fields.value.find(({ name }) => name === "activate")?.value),
	};
};

const execute = async (configData: TConfigData) => {
	if (!validateFields()) return;
	emits("execute", { data: configData, exchangeName: String(choosedExchange.value || "") });
};

// обновляем disabled у "allowedSymbols" при выборе биржи
const exchangeFieldsValue = computed(() => String(fields.value.find(({ name }) => name === "exchange")?.value));
const allowedSymbolsField = computed(() => fields.value.find(({ name }) => name === "allowedSymbols"));

watch(exchangeFieldsValue, (v) => {
	choosedExchange.value = v;
	if (allowedSymbolsField.value) allowedSymbolsField.value.disabled = !v;
});
</script>
