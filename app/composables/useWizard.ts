/**
 * Хранит состояние активации/завершённости шагов для формы-визарда.
 *
 * @param _items - Шаги или геттер/ref, их возвращающий.
 * @returns Реактивное состояние шагов плюс хелперы для перехода между ними и отметки шага завершённым.
 */
export const useWizard = (_items: MaybeRefOrGetter<WizardItem[]>) => {
	const steps = ref(toValue(_items));

	const activeStep = computed(() => steps.value.findLast((i) => i.active));
	const activeStepIndex = computed(() => steps.value.findLastIndex((i) => i.active));

	const setCompleteByIndex = (index: number, isCompleted: boolean) => {
		const item = steps.value[index];
		if (item) item.completed = isCompleted;
	};

	const setActiveByIndex = (index: number) => {
		steps.value.forEach((i, idx) => {
			i.active = idx === index;
		});
	};

	return { steps, activeStep, activeStepIndex, setCompleteByIndex, setActiveByIndex };
};
