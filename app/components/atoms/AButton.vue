<template>
	<button
		class="cursor-pointer disabled:cursor-default disabled:opacity-50 transition-opacity"
		:class="classesByMode"
		:disabled="disabled"
		type="button"
	>
		<slot />
	</button>
</template>
<script setup lang="ts">
const { mode } = defineProps({
	mode: {
		type: String,
		default: "default",
		validator: (s: string) => ["default", "remove-fill", "remove-border", "neutral-fill"].includes(s),
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const classesByMode = computed(() => {
	switch (mode) {
		case "remove-fill":
			return "text-white/80 bg-secondary-300";
		case "remove-border":
			return "border-1 border-solid border-secondary-400 text-secondary-500 bg-primary-100 transition hover:border-secondary-500 hover:text-secondary-600";
		case "neutral-fill":
			return "transition text-white/80 hover:text-white/90 hover:bg-neutral-400 bg-neutral-300";
		default:
			return "";
	}
});
</script>
