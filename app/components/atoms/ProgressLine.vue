<template>
	<div class="flex flex-col gap-8">
		<div class="w-full h-6 rounded-12 bg-white/5 overflow-hidden">
			<div
				class="bg-tertiary-800 h-full"
				:style="{ width: `${value >= 0 ? percent * 100 : 0}%` }"
			/>
		</div>
		<slot name="footer" v-bind="{ percent }" />
	</div>
</template>
<script setup lang="ts">
const { max, value } = defineProps<{
	max: number;
	value: number;
}>();

const percent = computed(() => {
	if (isNaN(max) || max === 0) return 0;
	return value / max;
});
</script>
