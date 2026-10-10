<template>
	<div class="flex flex-col gap-6">
		<LabelField v-if="label" v-model:error="error" :label="label" :tooltip-text="tooltipText" />
		<div
			class="group transition flex items-center px-16 bg-black h-48 rounded-4 border-solid border"
			:class="[
				error && 'border-secondary-500/50 hover:border-secondary-500/70',
				!error && 'border-neutral-100 hover:border-neutral-200'
			]"
		>
			<component
				:is="icon"
				v-if="icon"
				class="transition min-w-15 lg:min-w-18 max-w-15 lg:max-w-18 min-h-15 lg:min-h-18 max-h-15 lg:max-h-18 block mr-8 transition"
				:class="[
					error && 'text-secondary-500',
					!error && 'text-primary-700'
				]"
			/>
			<input
				class="grow min-w-0 h-full text-neutral-500 focus:text-neutral-600 transition text-14 lg:text-16"
				:placeholder="placeholder"
				:type="inputType"
				:disabled="disabled"
				:value="value"
				@input="onInput($event)"
			>
			<AButton
				v-if="type === 'password'"
				class="max-w-18 lg:max-w-22 min-w-18 lg:min-w-22 min-h-16 lg:min-h-20 max-h-16 lg:max-h-20 flex justify-center items-center ml-8"
				@click="showPassword = !showPassword"
			>
				<IconVisibilityOffOutline v-if="showPassword" class="w-full h-full text-primary-700" />
				<IconVisibilityOutlineRounded v-else class="w-full h-full text-primary-700" />
			</AButton>
		</div>
	</div>
</template>
<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";
import LabelField from "@/components/atoms/LabelField.vue";
import IconVisibilityOffOutline from "@/assets/icons/visibility-off-outline.svg";
import IconVisibilityOutlineRounded from "@/assets/icons/visibility-outline-rounded.svg";
import IconAccountCircle from "@/assets/icons/account-circle.svg";
import IconLockOutline from "@/assets/icons/lock-outline.svg";
import IconSearchRounded from "@/assets/icons/search-rounded.svg";
import type { InputTypeHTMLAttribute } from "vue";

const props = withDefaults(
	defineProps<{
		label?: string;
		prependIcon?: string;
		tooltipText?: string;
		type?: InputTypeHTMLAttribute;
		placeholder?: string;
		disabled?: boolean;
	}>(),
	{
		label: "",
		prependIcon: "",
		tooltipText: "",
		type: "text",
		placeholder: "",
		disabled: false,
	}
);

const icon = computed(() => {
	switch (props.prependIcon) {
		case "account-circle":
			return IconAccountCircle;
		case "lock-outline":
			return IconLockOutline;
		case "search-rounded":
			return IconSearchRounded;
		default:
			return null;
	}
});

const value = defineModel<string | number>({ default: "" });
const error = defineModel<string>("error", { default: "" });

const showPassword = ref(false);

const inputType = computed<InputTypeHTMLAttribute>(() => {
	if (props.type !== "password") return props.type;
	return !showPassword.value ? "password" : "text";
});

// Пробелы обрезаем только у не-парольных значений (email/name), чтобы не ломать
// пароли и API-ключи, где пробел — валидный символ.
const onInput = (event: InputEvent) => {
	const target = event.target;
	if (!(target instanceof HTMLInputElement)) return;

	const raw = target.value;
	const val = props.type === "password" ? raw : raw.trim();

	if (props.type === "number") value.value = parseInt(val, 10) || 0;
	else value.value = val;
};
</script>
