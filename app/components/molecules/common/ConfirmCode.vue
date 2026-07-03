<template>
	<div class="flex flex-col gap-30">
		<div class="flex flex-col gap-10">
			<h3 v-if="title" class="font-bold text-18 lg:text-20 text-neutral-800">{{ title }}</h3>
			<slot name="subtitle" />
		</div>
		<div class="flex flex-col gap-10">
			<span class="text-12 lg:text-14 uppercase text-neutral-500">Код подтверждения</span>
			<input
				ref="inputCode"
				v-maska:code.unmasked="{ mask: maskPattern, eager: true }"
				class="text-22 lg:text-24 font-bold border-1 border-solid text-neutral-500 text-center rounded-12 transition p-16"
				:class="[
					code.length >= codeLen && 'bg-neutral-950',
					code.length < codeLen && 'bg-neutral-800 hover:bg-neutral-950',
					!codeIsValid && 'text-secondary-400 border-secondary-400'
				]"
				type="text"
				:placeholder="placeholder"
				@input="codeIsValid = true"
			>
			<div class="flex justify-center items-center gap-10">
				<AButton
					class="text-14 lg:text-16 text-neutral-600"
					:disabled="!isOver"
					@click="sendCodeAgain"
				>Отправить код еще раз</AButton>
				<span class="text-14 lg:text-16 text-neutral-500">({{ formatTime(currentTime) }})</span>
			</div>
		</div>
		<div class="flex flex-col lg:flex-row-reverse gap-10">
			<AButton
				class="text-14 lg:text-16 p-10 rounded-8 lg:w-1/2"
				mode="primary-fill"
				@click="submit"
			>
				{{ sendTextBtn }}
			</AButton>
			<AButton
				class="text-14 lg:text-16 p-10 rounded-8 lg:w-1/2"
				mode="remove-border"
				@click="emits('cancel')"
			>
				{{ cancelTextBtn }}
			</AButton>
		</div>
	</div>
</template>
<script setup lang="ts">
import * as z from "zod";
import AButton from "@/components/atoms/AButton.vue";

const { codeLen } = defineProps<{
	title: string;
	codeLen: number;
	sendTextBtn: string;
	cancelTextBtn: string;
}>();

const emits = defineEmits(["submit", "cancel", "sendCodeAgain"]);

const { currentTime, isOver, stop: stopTimer, start: startTimer } = useTimer(0, { defaultTime: 60 * 1000, mode: "down" });

const code = defineModel({ type: String, default: "" });

const inputCodeEl = useTemplateRef<HTMLInputElement | null>("inputCode");

const maskPattern = computed(() => "# ".repeat(codeLen).slice(0, codeLen * 2 - 1));
const placeholder = computed(() => maskPattern.value.replace(/#/g, "0"));

const codeIsValid = ref(true);

const submit = () => {
	codeIsValid.value = z.string().min(codeLen).safeParse(code.value).success;

	if (!codeIsValid.value) {
		inputCodeEl.value?.focus();
		return;
	}

	emits("submit");
};

const reset = async () => {
	code.value = "";
	stopTimer(true);

	await nextTick();
	if (inputCodeEl.value) inputCodeEl.value.value = "";
};

const sendCodeAgain = async () => {
	await reset();
	startTimer();
	emits("sendCodeAgain");
};

defineExpose({ code, reset, startTimer });
</script>
