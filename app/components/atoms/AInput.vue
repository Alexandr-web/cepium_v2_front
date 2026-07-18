<template>
	<div class="flex flex-col gap-6">
		<h3
			v-if="label"
			class="text-12 lg:text-14 transition"
			:class="[
				error && 'text-secondary-500',
				!error && 'text-primary-700'
			]"
		>{{ label }}</h3>
		<div
			class="group transition flex items-center px-16 bg-neutral-100 h-48 rounded-4 border-solid border-1"
			:class="[
				error && 'border-secondary-500/50 hover:border-secondary-500/70',
				!error && 'border-white/5 hover:border-white/10'
			]"
		>
			<Icon
				v-if="preppendIcon"
				:name="preppendIcon"
				class="transition min-w-15 lg:min-w-18 max-w-15 lg:max-w-18 min-h-15 lg:min-h-18 max-h-15 lg:max-h-18 block mr-8 transition"
				:class="[
					error && 'text-secondary-500',
					!error && 'text-primary-700'
				]"
			/>
			<input
				v-model.trim="value"
				class="grow min-w-0 h-full text-neutral-500 focus:text-neutral-600 transition text-14 lg:text-16"
				:placeholder="String($attrs.placeholder)"
				:type="inputType"
				:disabled="Boolean($attrs.disabled)"
			>
			<AButton
				v-if="$attrs.type === 'password'"
				class="max-w-18 lg:max-w-22 min-w-18 lg:min-w-22 min-h-16 lg:min-h-20 max-h-16 lg:max-h-20 flex justify-center items-center ml-8"
				@click="showPassword = !showPassword"
			>
				<Icon v-show="showPassword" class="w-full h-full text-primary-700" name="material-symbols:visibility-off-outline" />
				<Icon v-show="!showPassword" class="w-full h-full text-primary-700" name="material-symbols:visibility-outline-rounded" />
			</AButton>
		</div>
	</div>
</template>
<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";
import type { InputTypeHTMLAttribute, PropType } from "vue";
import type z from "zod";

const { check } = defineProps({
	label: {
		type: String,
		default: "",
	},
	preppendIcon: {
		type: String,
		default: "",
	},
	check: {
		type: Object as PropType<z.ZodType>,
		default: undefined,
	},
});

const attrs = useAttrs();

const value = defineModel<string>({ default: "" });
const error = defineModel<string>("error", { default: "" });

const showPassword = ref(false);

const checkValidMessage = computed(() => check?.safeParse(value.value)?.error?.message ?? "");
const inputType = computed<InputTypeHTMLAttribute>(() => {
	if (!attrs.type) return "text";
	if (attrs.type !== "password") return String(attrs.type);
	return !showPassword.value ? "password" : "text";
});

watch(value, (v) => (error.value = !v ? "" : checkValidMessage.value));
</script>
