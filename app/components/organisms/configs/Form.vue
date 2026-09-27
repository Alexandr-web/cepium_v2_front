<template>
	<section class="flex flex-col gap-12 lg:gap-24 w-full lg:max-w-1200 lg:mx-auto">
		<h2 class="text-20 lg:text-24 font-semibold">{{ title }}</h2>
		<Wizard
			ref="wizardRef"
			:items="steps"
			:is-pending="!fieldsByStep.length"
			:check="validateStepFields"
			@execute="execute"
		>
			<template #default="activeStep">
				<div class="flex flex-col gap-16 lg:gap-24">
					<h3 class="text-12 lg:text-16 text-center lg:text-start text-neutral-700 lg:text-neutral-800 font-medium lg:font-semibold uppercase border-b border-b-white/8 pb-10">{{ activeStep.label }}</h3>
					<div class="grow grid grid-cols-1 lg:grid-cols-2 gap-16">
						<component
							:is="field.component"
							v-for="field in fieldsByStep"
							:key="field.name"
							v-model="field.value"
							v-model:error="field.error"
							:check="field.check"
							:placeholder="field.placeholder"
							:label="field.label"
							:type="field.type"
							:items="field.items"
							:disabled="field.disabled"
							:search="field.search"
							:item-click-handler="field.itemClickHandler"
							:max="field.max"
							:min="field.min"
							:show-tooltip="field.showTooltip"
							:format="field.format"
							:size="field.size"
							:tooltip-text="field.tooltipText"
							:class="field.classes"
						/>
					</div>
				</div>
			</template>
		</Wizard>
	</section>
	<Teleport to="body">
		<Modal :model-value="!!selectedSymbol" @close="selectedSymbol = null">
			<CoinTicker v-if="selectedSymbol" :symbol="selectedSymbol" />
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import * as z from "zod";
import ASelect from "@/components/atoms/ASelect.vue";
import AInput from "@/components/atoms/AInput.vue";
import SearchList from "@/components/molecules/common/SearchList.vue";
import ASlider from "@/components/atoms/ASlider.vue";
import ACheckbox from "@/components/atoms/ACheckbox.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import CoinTicker from "@/components/molecules/widgets/CoinTicker.vue";
import Wizard from "@/components/molecules/common/Wizard.vue";
import { useMarketsSearch } from "@/composables/api/useExchanges";
import { useCoinGeckoSearch } from "@/composables/api/useCoinGecko";

const props = withDefaults(
	defineProps<{
		strategies: StrategyEntity[];
		exchanges: ExchangeDto[];
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

/**
 * Соответствие "имя шага -> имена полей, которые к нему относятся".
 * Используется и в `fieldsByStep` (что рендерить на активном шаге), и в
 * `isStepValid` (уже ли валидны поля шага) - так они не могут разойтись.
 */
const STEP_FIELDS: Record<string, string[]> = {
	"exchange-strategy": ["exchange", "margin", "strategyId"],
	"risk-management": ["maxLossPercent", "dailyGoalPercent", "maxPositionSize", "maxLeverage"],
	"assets-launch": ["allowedSymbols", "activate"],
};

const { findCoinId } = useCoinGeckoSearch();
const { searchMarkets } = useMarketsSearch();

const emits = defineEmits(["execute"]);

const wizardRef = ref<typeof Wizard | null>(null);
const selectedSymbol = ref<string | null>(null);

const strategiesList = computed<SelectItem[]>(() => props.strategies.map((s) => ({ label: s.name, value: s.id })) ?? []);
const exchangesList = computed<SelectItem[]>(() =>
	props.exchanges
		.filter((item) => item.filled)
		.map((item) => ({ label: item.name, value: item.name }))
);

const MARGIN_MODE_LIST: SelectItem[] = [
	{ label: "Изолированная", value: "isolated" },
	{ label: "Кросс", value: "cross" },
];

const fields: Ref<GeneralFormField[]> = ref([
	{
		name: "exchange",
		value: String(props.data?.exchangeName ?? ""),
		check: z.string().min(1),
		error: "",
		label: "Биржа",
		placeholder: "Выберите биржу",
		component: markRaw(ASelect),
		get items() {
			return exchangesList.value;
		},
		get disabled() {
			return props.isPendingExchanges || !exchangesList.value.length;
		},
		tooltipText: "Укажите биржу, где будут исполняться торговые ордера. Убедитесь, что для неё подключены активные API-ключи.",
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
	},
	{
		name: "strategyId",
		value: String(props.data?.strategy?.id ?? ""),
		check: z.string().min(1),
		error: "",
		label: "Стратегия",
		placeholder: "Выберите стратегию",
		component: markRaw(ASelect),
		get items() {
			return strategiesList.value;
		},
		get disabled() {
			return props.isPendingStrategy;
		},
		tooltipText: "Определяет алгоритм и правила, по которым сервис будет искать точки входа в рынок.",
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
	},
	{
		name: "allowedSymbols",
		value: [...(props.data?.allowedSymbols ?? [])],
		check: z.array(z.string()).min(1),
		error: "",
		get disabled() {
			return !selectedExchangeValue.value;
		},
		label: "Список отслеживаемых монет",
		placeholder: "Поиск отслеживаемых монет",
		component: markRaw(SearchList),
		tooltipText: "Список активов, на которых сервис будет искать точки входа. Стратегия будет анализировать графики только выбранных вами монет.",
		classes: "lg:col-span-2",
		itemClickHandler: async (item: SelectItem) => {
			const id = await findCoinId(item.value);
			if (id) selectedSymbol.value = id;
		},
		search: async (search: string): Promise<SelectItem[]> => {
			const res = await searchMarkets(selectedExchangeValue.value, search);
			return res.data.map((s) => ({ label: s.symbol, value: s.symbol })) ?? [];
		},
	},
	{
		name: "activate",
		value: Boolean(props.data?.activate ?? true),
		label: "Активировать",
		component: markRaw(ACheckbox),
		tooltipText: "Запускает конфигурацию в работу. Сервис сразу начнет отслеживать выбранные монеты и открывать сделки по заданной стратегии.",
		size: CheckboxSize.BIG,
	},
]);

const selectedExchangeValue = computed(() => String(fields.value.find((i) => i.name === "exchange")?.value ?? ""));

// Валидны ли прямо сейчас все поля, относящиеся к шагу `stepName`.
const isStepValid = (stepName: string) =>
	(STEP_FIELDS[stepName] ?? []).every((name) => {
		const field = fields.value.find((i) => i.name === name);
		return !field ? true : (!field.check || field.check.safeParse(field.value).success);
	});

/**
 * Шаги визарда. `fields` объявлен выше специально для того, чтобы здесь
 * можно было сразу, при инициализации, посчитать `completed` через
 * `isStepValid` - без отдельного прохода после создания массива.
 *
 * В режиме редактирования (`props.data` задан) поля уже заполнены
 * значениями из конфига, поэтому уже валидные шаги сразу помечаются
 * завершёнными.
 */
const steps = ref([
	{ completed: !!props.data && isStepValid("exchange-strategy"), active: true, name: "exchange-strategy", label: "Биржа и стратегия" },
	{ completed: !!props.data && isStepValid("risk-management"), active: false, name: "risk-management", label: "Управление рисками" },
	{ completed: !!props.data && isStepValid("assets-launch"), active: false, name: "assets-launch", label: "Активы и запуск" },
]);

// Поля, относящиеся к текущему активному шагу визарда.
const fieldsByStep = computed(() =>
	fields.value.filter((i) => STEP_FIELDS[wizardRef.value?.activeName ?? ""]?.includes(i.name))
);

const { validateFields } = useForm(fields);
const { validateFields: validateStepFields } = useForm(fieldsByStep);

// Собирает плоский список полей обратно в форму, ожидаемую API.
const normalizedData = computed((): ConfigData => {
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
});

const execute = async () => {
	if (!validateFields()) return;
	emits("execute", { data: normalizedData.value, exchangeName: selectedExchangeValue.value });
};
</script>
