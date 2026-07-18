<template>
	<div class="flex items-center gap-10 cursor-pointer select-none group" @click="emits('update:modelValue', !modelValue)">
		<div
			class="w-16 h-16 rounded-6 border-solid border-1 border-neutral-400"
			:class="[modelValue && 'border-primary-400 bg-primary-300']"
		>
			<IconCheckSmallRounded v-if="modelValue" class="w-full h-full" />
		</div>
		<span v-if="label" class="transition group-hover:text-neutral-900">{{ label }}</span>
	</div>
</template>
<script setup lang="ts">
import IconCheckSmallRounded from "@/assets/icons/check-small-rounded.svg";

defineProps<{ modelValue: boolean; label?: string; }>();

const emits = defineEmits(["update:modelValue"]);
</script>
