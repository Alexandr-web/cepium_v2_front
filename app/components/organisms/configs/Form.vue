<template>
	<section class="flex flex-col gap-12 lg:gap-24">
		<h2 class="text-20 lg:text-24 font-semibold">{{ title }}</h2>
		<Wizard
			ref="wizardRef"
			:items="steps"
			:is-pending="isPendingStrategy || isPendingExchanges"
			:check="validateStepFields"
			@execute="execute"
		>
			<template #default="activeStep">
				<div class="flex flex-col gap-16 lg:gap-24">
					<h3 class="text-12 lg:text-16 text-center lg:text-start text-neutral-700 lg:text-neutral-800 font-medium lg:font-semibold uppercase border-b border-b-white/8 pb-10">{{ activeStep.label }}</h3>
					<div class="grow grid grid-cols-1 lg:grid-cols-2 gap-16">
						<template v-if="activeStep.name === 'exchange-strategy'">
							<ASelect
								v-model="fields.exchange.value"
								v-model:error="fields.exchange.error"
								label="Биржа"
								placeholder="Выберите биржу"
								:items="exchangesList"
								:disabled="isPendingExchanges || !exchangesList.length"
								tooltip-text="Укажите биржу, где будут исполняться торговые ордера. Убедитесь, что для неё подключены активные API-ключи."
							/>
							<ASelect
								v-model="fields.margin.value"
								v-model:error="fields.margin.error"
								label="Маржа"
								placeholder="Выберите режим маржи"
								:items="MARGIN_MODE_LIST"
								tooltip-text="Определяет, какими средствами вы рискуете. Кросс-маржа использует весь доступный баланс для удержания позиций. Изолированная маржа жестко ограничивает убыток размером самой сделки."
							/>
							<ASelect
								v-model="fields.strategyId.value"
								v-model:error="fields.strategyId.error"
								label="Стратегия"
								placeholder="Выберите стратегию"
								:items="strategiesList"
								:disabled="isPendingStrategy"
								tooltip-text="Определяет алгоритм и правила, по которым сервис будет искать точки входа в рынок."
							/>
						</template>
						<template v-else-if="activeStep.name === 'risk-management'">
							<ASlider
								v-model="fields.maxLossPercent.value"
								v-model:error="fields.maxLossPercent.error"
								label="Максимальный процент убытка"
								show-tooltip="focus"
								:format="(v: number) => formatNum(v / 100, { style: 'percent' })"
								tooltip-text="Ограничение максимальных потерь. При падении цены на указанный процент сервис автоматически закроет позицию в убыток, чтобы защитить оставшийся баланс от дальнейшего падения."
							/>
							<ASlider
								v-model="fields.dailyGoalPercent.value"
								v-model:error="fields.dailyGoalPercent.error"
								label="Процент выполнения дневной цели"
								show-tooltip="focus"
								:format="(v: number) => formatNum(v / 100, { style: 'percent' })"
								tooltip-text="Желаемая прибыль за сутки в процентах от баланса."
							/>
							<ASlider
								v-model="fields.maxPositionSize.value"
								v-model:error="fields.maxPositionSize.error"
								label="Максимальный процент от баланса для открытия сделки"
								show-tooltip="focus"
								:format="(v: number) => formatNum(v / 100, { style: 'percent' })"
								tooltip-text="Ограничивает максимальный размер одной сделки. Задает долю от вашего общего баланса, которую сервис может использовать в качестве стартовой маржи для входа в одну позицию."
							/>
							<AInput
								v-model="fields.maxLeverage.value"
								v-model:error="fields.maxLeverage.error"
								label="Максимальное плечо"
								type="number"
								tooltip-text="Верхний лимит кредитного плеча для сделок. Множитель заемных средств от биржи, который увеличивает объем позиции."
							/>
						</template>
						<template v-else>
							<SearchList
								v-model="fields.allowedSymbols.value"
								v-model:error="fields.allowedSymbols.error"
								label="Список отслеживаемых монет"
								placeholder="Поиск отслеживаемых монет"
								:search="searchSymbols"
								:item-click-handler="onSymbolClick"
								:disabled="!selectedExchangeValue"
								tooltip-text="Список активов, на которых сервис будет искать точки входа. Стратегия будет анализировать графики только выбранных вами монет."
								class="lg:col-span-2"
							/>
							<ACheckbox
								v-model="fields.activate.value"
								label="Активировать"
								:size="CheckboxSize.BIG"
								tooltip-text="Запускает конфигурацию в работу. Сервис сразу начнет отслеживать выбранные монеты и открывать сделки по заданной стратегии."
							/>
						</template>
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

const { fields, validate, isFieldValid } = useFormState({
	exchange: { value: String(props.data?.exchangeName ?? ""), error: "", check: z.string().min(1) },
	margin: { value: String(props.data?.margin ?? ""), error: "", check: z.string().min(1) },
	strategyId: { value: String(props.data?.strategy?.id ?? ""), error: "", check: z.string().min(1) },
	maxLossPercent: { value: Number(props.data?.maxLossPercent ?? 1), error: "", check: z.number().min(1) },
	dailyGoalPercent: { value: Number(props.data?.dailyGoalPercent ?? 1), error: "", check: z.number().min(1) },
	maxPositionSize: { value: Number(props.data?.maxPositionSize ?? 1), error: "", check: z.number().min(1) },
	maxLeverage: { value: Number(props.data?.maxLeverage ?? 1), error: "", check: z.number().min(1) },
	allowedSymbols: { value: [...(props.data?.allowedSymbols ?? [])], error: "", check: z.array(z.string()).min(1) },
	activate: { value: Boolean(props.data?.activate ?? true), error: "" },
});

const selectedExchangeValue = computed(() => fields.exchange.value);

const searchSymbols = async (search: string): Promise<SelectItem[]> => {
	const res = await searchMarkets(selectedExchangeValue.value, search);
	return res.data.map((s) => ({ label: s.symbol, value: s.symbol })) ?? [];
};

const onSymbolClick = async (item: SelectItem) => {
	const id = await findCoinId(item.value);
	if (id) selectedSymbol.value = id;
};

/**
 * Соответствие "имя шага -> ключи полей, которые к нему относятся".
 * Используется и в `validateStepFields`, и в `isStepValid` - так они не разойдутся.
 */
const STEP_FIELDS: Record<string, string[]> = {
	"exchange-strategy": ["exchange", "margin", "strategyId"],
	"risk-management": ["maxLossPercent", "dailyGoalPercent", "maxPositionSize", "maxLeverage"],
	"assets-launch": ["allowedSymbols", "activate"],
};

// Валидны ли прямо сейчас все поля, относящиеся к шагу `stepName` (без простановки ошибок).
const isStepValid = (stepName: string) =>
	(STEP_FIELDS[stepName] ?? []).every((name) => isFieldValid(name));

/**
 * Шаги визарда. `useFormState` вызван выше, чтобы здесь можно было сразу
 * посчитать `completed` через `isStepValid` без отдельного прохода.
 */
const steps = ref([
	{ completed: !!props.data && isStepValid("exchange-strategy"), active: true, name: "exchange-strategy", label: "Биржа и стратегия" },
	{ completed: !!props.data && isStepValid("risk-management"), active: false, name: "risk-management", label: "Управление рисками" },
	{ completed: !!props.data && isStepValid("assets-launch"), active: false, name: "assets-launch", label: "Активы и запуск" },
]);

// Валидирует поля активного шага и проставляет им ошибки.
const validateStepFields = (): boolean =>
	validate(STEP_FIELDS[wizardRef.value?.activeName ?? ""] ?? []);

// Собирает типизированный объект данных для отправки в API.
const values = computed<ConfigData>(() => ({
	margin: fields.margin.value,
	allowedSymbols: fields.allowedSymbols.value,
	maxLeverage: fields.maxLeverage.value,
	maxLossPercent: fields.maxLossPercent.value,
	strategyId: fields.strategyId.value,
	dailyGoalPercent: fields.dailyGoalPercent.value,
	maxPositionSize: fields.maxPositionSize.value,
	activate: fields.activate.value,
}));

const execute = () => {
	if (!validate()) return;
	emits("execute", { data: values.value, exchangeName: selectedExchangeValue.value });
};
</script>
