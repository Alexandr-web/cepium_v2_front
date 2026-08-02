<template>
	<div class="flex items-center gap-10 cursor-pointer select-none group" @click="emits('update:modelValue', !modelValue)">
		<div
			v-if="!hideBox"
			class="rounded-6 border-solid border border-neutral-400"
			:class="[
				(modelValue && theme === 'primary') && 'border-primary-400 bg-primary-300',
				(modelValue && theme === 'neutral') && 'border-neutral-400 bg-neutral-800',
				size === 'small' && 'w-16 h-16',
				size === 'big' && 'w-24 h-24',
			]"
		>
			<IconCheckSmallRounded
				v-if="modelValue"
				class="w-full h-full"
				:class="[
					theme === 'primary' && 'text-white/80',
					theme === 'neutral' && 'text-primary-200'
				]"
			/>
		</div>
		<span v-if="label" class="transition group-hover:opacity-100 opacity-80">{{ label }}</span>
	</div>
</template>
<script setup lang="ts">
import IconCheckSmallRounded from "@/assets/icons/check-small-rounded.svg";

withDefaults(
	defineProps<{
		modelValue?: boolean;
		label?: string;
		size?: "small" | "big";
		hideBox?: boolean;
		theme?: "primary" | "neutral";
	}>(),
	{
		modelValue: false,
		label: "",
		size: "small",
		hideBox: false,
		theme: "primary",
	}
);

const emits = defineEmits(["update:modelValue"]);
</script>
