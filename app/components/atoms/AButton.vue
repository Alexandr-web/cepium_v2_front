<template>
	<button class="cursor-pointer" :class="classesByMode">
		<slot />
	</button>
</template>
<script setup lang="ts">
const { mode } = defineProps({
	mode: {
		type: String,
		default: "default",
		validator: (s: string) => ["default", "remove-fill", "remove-border"].includes(s),
	},
});

const classesByMode = computed(() => {
	switch (mode) {
		case "remove-fill":
			return "text-white/80 bg-secondary-300";
		case "remove-border":
			return "border-1 border-solid border-secondary-400 text-secondary-500 bg-primary-100 transition hover:border-secondary-500 hover:text-secondary-600";
		default:
			return "";
	}
});
</script>
