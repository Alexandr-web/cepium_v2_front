<template>
	<div class="flex flex-col lg:flex-row gap-12 lg:gap-36">
		<div class="flex lg:flex-col flex-wrap justify-center lg:justify-start gap-2 lg:gap-6 lg:basis-[10%]">
			<div
				v-for="(step, idx) in steps"
				:key="step.name"
				class="flex lg:flex-col lg:items-center gap-5 lg:gap-10"
			>
				<div
					v-if="idx > 0"
					class="w-15 lg:w-2 h-2 lg:h-45 bg-neutral-400 my-auto"
					:class="[step.completed && 'bg-neutral-600']"
				/>
				<div class="flex flex-col items-center gap-5">
					<div
						class="flex items-center justify-center transition w-36 lg:w-46 h-36 lg:h-46 rounded-full border"
						:class="[
							step.active && 'border-primary-600 bg-primary-300',
							(step.completed && !step.active) && 'border-tertiary-600 bg-tertiary-300',
							!step.completed && 'border-neutral-200',
						]"
					>
						<IconCheck v-if="step.completed && !step.active" class="w-18 lg:w-26 h-18 lg:h-26 text-white" />
						<p
							v-else
							class="text-10 lg:text-14 transition"
							:class="[(!step.completed && !step.active) && 'opacity-50']"
						>{{ idx + 1 }}</p>
					</div>
					<p
						v-if="step.label"
						class="text-10 lg:text-12 text-center max-w-100 lg:max-w-200 transition"
						:class="[(!step.completed && !step.active) && 'opacity-50']"
					>{{ step.label }}</p>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-24 relative lg:basis-[90%] bg-black/80 rounded-8 lg:rounded-12 p-12 lg:p-24 border border-neutral-200 min-h-100">
			<div v-if="isPending" class="absolute top-0 left-0 w-full h-full flex justify-center items-center z-1">
				<IconLoader class="w-16 lg:w-24 h-16 lg:h-24" />
			</div>
			<template v-else>
				<slot v-bind="activeStep" />
				<div class="flex justify-end items-center gap-8 mt-auto">
					<AButton
						:mode="ButtonMode.NEUTRAL_FILL"
						:disabled="activeStepIndex === 0"
						class="px-22 py-8 rounded-8 text-12 lg:text-14"
						@click="goPrev"
					>Назад</AButton>
					<AButton
						:mode="activeStepIndex === steps.length - 1 ? ButtonMode.TERTIARY_BORDER : ButtonMode.PRIMARY_BORDER"
						class="px-22 py-8 rounded-8 text-12! lg:text-14!"
						@click="goNext"
					>{{ nextBtnText }}</AButton>
				</div>
			</template>
		</div>
	</div>
</template>
<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";
import IconCheck from "@/assets/icons/check-small-rounded.svg";
import IconLoader from "@/assets/icons/loader.svg";

const props = withDefaults(
	defineProps<{
		items: WizardItem[];
		isPending?: boolean;
		/**
		 * Вызывается перед уходом с текущего шага (по клику "Дальше"/"Сохранить").
		 * Должна провалидировать поля этого шага и вернуть, валидны ли они.
		 * Если не передана - считается, что шаг всегда валиден.
		 */
		check?: () => boolean;
	}>(),
	{
		isPending: false,
		check: undefined,
	}
);

const emits = defineEmits(["execute"]);

const { activeStepIndex, steps, activeStep, setActiveByIndex, setCompleteByIndex } = useWizard(() => props.items);

const nextBtnText = computed(() => activeStepIndex.value >= steps.value.length - 1 ? "Сохранить" : "Дальше");

const goPrev = () => setActiveByIndex(activeStepIndex.value - 1);

/**
 * Валидирует текущий шаг через `props.check`, проставляет ему
 * completed/несовершённый статус и только после этого либо переходит на
 * следующий шаг, либо - на последнем шаге, и только если валидация
 * прошла - эмитит "execute" для отправки всей формы.
 */
const goNext = () => {
	const isValidate = props.check?.() ?? true;
	setCompleteByIndex(activeStepIndex.value, isValidate);
 
	if (!isValidate) return;
 
	if (activeStepIndex.value < steps.value.length - 1) {
		setActiveByIndex(activeStepIndex.value + 1);
		return;
	}
	
	emits("execute");
};

defineExpose({ activeName: computed(() => String(activeStep.value?.name)) });
</script>
