<template>
	<div class="flex flex-col gap-24">
		<LabelField v-model:error="error" :label="label" :count="percent" :tooltip-text="tooltipText" />
		<Slider
			v-model="value"
			:min="min"
			:max="max"
			:show-tooltip="showTooltip"
			:format="format"
			class="slider-blue"
		/>
	</div>
</template>
<script setup lang="ts">
import LabelField from "@/components/atoms/LabelField.vue";
import Slider from "@vueform/slider";

import "@vueform/slider/themes/default.css";

withDefaults(
	defineProps<{
		label: string;
		max?: number;
		min?: number;
		showTooltip?: string;
		tooltipText?: string;
		format?: object|((v: number) => unknown)
	}>(),
	{
		max: 100,
		min: 0,
		showTooltip: "always",
		tooltipText: "",
		format: undefined,
	}
);

const value = defineModel<number>({ default: 0 });
const error = defineModel<string>("error", { default: "" });

const percent = computed(() => formatNum(value.value / 100, { style: "percent" }));
</script>

<style scoped>
.slider-blue {
  --slider-connect-bg: var(--color-primary-500);
  --slider-tooltip-bg: var(--color-primary-500);
  --slider-handle-width: calc(var(--spacing) * 16);
  --slider-handle-height: calc(var(--spacing) * 16);
  --slider-tooltip-font-size: calc(var(--spacing) * 14);
  --slider-handle-shadow: none;
}
</style>
