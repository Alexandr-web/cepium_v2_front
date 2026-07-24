<template>
	<div class="flex flex-col gap-24">
		<div class="flex items-center gap-5">
			<h3
				v-if="label"
				class="text-12 lg:text-14 transition"
				:class="[
					error && 'text-secondary-500',
					!error && 'text-primary-700'
				]"
			>{{ label }}</h3>
			<p class="text-neutral-600 text-12 lg:text-14">({{ percent }})</p>
		</div>
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
import Slider from "@vueform/slider";

import "@vueform/slider/themes/default.css";

const { max = 100, min = 0, showTooltip = "always", format = undefined } = defineProps<{
	label: string;
	max?: number;
	min?: number;
	showTooltip?: string;
	format?: object|((v: number) => unknown)
}>();

const value = defineModel<number>({ default: 0 });
const error = defineModel<string>("error", { default: "" });

const percent = computed(() => formatNum(value.value / 100, { style: "percent" }));
</script>

<style>
.slider-blue {
  --slider-connect-bg: var(--color-primary-500);
  --slider-tooltip-bg: var(--color-primary-500);
}
</style>
