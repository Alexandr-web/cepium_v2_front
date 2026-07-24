<template>
	<div class="flex items-center gap-10 cursor-pointer select-none group" @click="emits('update:modelValue', !modelValue)">
		<div
			class="rounded-6 border-solid border-1 border-neutral-400"
			:class="[
				modelValue && 'border-primary-400 bg-primary-300',
				size === 'small' && 'w-16 h-16',
				size === 'big' && 'w-24 h-24',
			]"
		>
			<IconCheckSmallRounded v-if="modelValue" class="w-full h-full" />
		</div>
		<span v-if="label" class="transition group-hover:opacity-100 opacity-80">{{ label }}</span>
	</div>
</template>
<script setup lang="ts">
import IconCheckSmallRounded from "@/assets/icons/check-small-rounded.svg";

defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		default: "",
	},
	size: {
		type: String,
		default: "small",
		validator: (s: string) => ["small", "big"].includes(s),
	},
});

const emits = defineEmits(["update:modelValue"]);
</script>
