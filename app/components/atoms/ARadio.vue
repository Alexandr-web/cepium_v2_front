<template>
	<div class="flex items-center gap-10">
		<div
			class="w-16 h-16 rounded-6 border-solid border-1 border-neutral-400"
			:class="[modelValue && 'border-primary-400 bg-primary-300']"
			@click="emits('update:modelValue', !modelValue)"
		>
			<Icon v-show="modelValue" name="material-symbols:check-small-rounded" class="w-full h-full" />
		</div>
		<slot name="label" v-bind="{ checked: modelValue }" />
	</div>
</template>
<script setup lang="ts">
defineProps<{ modelValue: boolean; }>();

const emits = defineEmits(["update:modelValue"]);
</script>
