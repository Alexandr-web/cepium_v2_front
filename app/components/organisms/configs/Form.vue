<template>
	<section class="flex flex-col gap-12 lg:max-w-1200 w-full lg:mx-auto">
		<h2 class="text-20 lg:text-24 font-semibold">{{ title }}</h2>
		<!-- @vue-generic {ConfigData}-->
		<GeneralForm
			:fields="fields"
			:normalized-data="normalizedData"
			:mode="FormMode.GRID"
			fields-list-classes="lg:grid-cols-6"
			@send="execute"
		>
			<template #content>
				<div class="flex flex-col-reverse lg:flex-row">
					<AButton
						class="w-full lg:w-auto rounded-4 py-10 px-24 lg:ml-auto"
						:mode="ButtonMode.PRIMARY_FILL"
						type="submit"
						:disabled="isPendingConfig"
					>
						{{ btnText }}
					</AButton>
				</div>
			</template>
		</GeneralForm>
	</section>
	<Teleport to="body">
		<Modal :model-value="!!choosedSymbol" @close="choosedSymbol = null">
			<CoinTicker v-if="choosedSymbol" :symbol="choosedSymbol" />
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import * as z from "zod";
import AButton from "@/components/atoms/AButton.vue";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import ASelect from "@/components/atoms/ASelect.vue";
import AInput from "@/components/atoms/AInput.vue";
import SearchList from "@/components/molecules/common/SearchList.vue";
import ASlider from "@/components/atoms/ASlider.vue";
import ACheckbox from "@/components/atoms/ACheckbox.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import CoinTicker from "@/components/molecules/widgets/CoinTicker.vue";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useMarketsSearch } from "@/composables/api/useExchanges";
import { useCoinGeckoSearch } from "@/composables/api/useCoinGecko";

const props = withDefaults(
	defineProps<{
		strategies: StrategyEntity[];
		isPendingStrategy: boolean;
		isPendingExchanges: boolean;
		isPendingConfig: boolean;
		title: string;
		btnText: string;
		data?: ConfigByIdResponse["data"];
	}>(),
	{
		data: undefined,
	}
);

const { findCoinId } = useCoinGeckoSearch();
const { searchMarkets } = useMarketsSearch();

const emits = defineEmits(["execute"]);

const exchangeStore = useExchangeStore();

const strategiesList = computed<SelectItem[]>(() => props.strategies.map((s) => ({ label: s.name, value: s.id })) ?? []);
const exchangesList = computed<SelectItem[]>(() => exchangeStore.getFilledExchanges());

const MARGIN_MODE_LIST: SelectItem[] = [
	{ label: "Изолированная", value: "isolated" },
	{ label: "Кросс", value: "cross" },
];

const choosedSymbol = ref<string|null>(null);
const choosedExchange = ref(props.data?.exchangeName || "");

const fields = ref<GeneralFormField[]>([
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
		tooltipText: "Укажите биржу, где будут исполняться торговые ордера. Убедитесь, что для неё подключены активные API-ключи.",
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
		tooltipText: "Определяет, какими средствами вы рискуете. Кросс-маржа использует весь доступный баланс для удержания позиций. Изолированная маржа жестко ограничивает убыток размером самой сделки.",
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
		tooltipText: "Определяет алгоритм и правила, по которым сервис будет искать точки входа в рынок.",
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
		tooltipText: "Ограничение максимальных потерь. При падении цены на указанный процент сервис автоматически закроет позицию в убыток, чтобы защитить оставшийся баланс от дальнейшего падения.",
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
		tooltipText: "Желаемая прибыль за сутки в процентах от баланса.",
		classes: "lg:col-span-3",
	},
	{
		name: "maxPositionSize",
		value: Number(props.data?.maxPositionSize ?? 1),
		check: z.number().min(1),
		error: "",
		label: "Максимальный процент от баланса для открытия сделки",
		placeholder: "Укажите максимальный процент от баланса для открытия сделки",
		component: markRaw(ASlider),
		showTooltip: "focus",
		format: (v: number) => formatNum(v / 100, { style: "percent" }),
		type: "number",
		tooltipText: "Ограничивает максимальный размер одной сделки. Задает долю от вашего общего баланса, которую сервис может использовать в качестве стартовой маржи для входа в одну позицию.",
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
		tooltipText: "Верхний лимит кредитного плеча для сделок. Множитель заемных средств от биржи, который увеличивает объем позиции.",
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
		tooltipText: "Список активов, на которых сервис будет искать точки входа. Стратегия будет анализировать графики только выбранных вами монет.",
		itemClickHandler: async (item: SelectItem) => {
			const id = await findCoinId(item.value);
			if (id) choosedSymbol.value = id;
		},
		search: async (search: string): Promise<SelectItem[]> => {
			const res = await searchMarkets(choosedExchange.value, search);
			return res.data.map((s) => ({ label: s.symbol, value: s.symbol })) ?? [];
		},
	},
	{
		name: "activate",
		value: props.data?.activate ?? true,
		label: "Активировать",
		component: markRaw(ACheckbox),
		tooltipText: "Запускает конфигурацию в работу. Сервис сразу начнет отслеживать выбранные монеты и открывать сделки по заданной стратегии.",
		size: CheckboxSize.BIG,
	},
]);

const { validateFields } = useForm(fields);

const normalizedData = (): ConfigData => {
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

const execute = async (configData: ConfigData) => {
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
