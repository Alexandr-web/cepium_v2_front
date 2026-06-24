<template>
	<div class="flex flex-col gap-8">
		<div class="w-full h-6 rounded-12 bg-white/5 overflow-hidden">
			<div
				class="bg-tertiary-800 h-full"
				:style="{ width: `${percent * 100}%` }"
			/>
		</div>
		<slot name="footer" v-bind="{ percent: percentFormat }" />
	</div>
</template>
<script setup lang="ts">
const { max, value } = defineProps<{
	max: number;
	value: number;
}>();

const percent = computed(() => value / max);
const percentFormat = computed(() => formatNum(percent.value, { style: "percent" }));
</script>
