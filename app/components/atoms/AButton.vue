<template>
	<button
		class="cursor-pointer disabled:cursor-default disabled:opacity-50"
		:class="classesByMode"
		:disabled="!!$attrs.disabled"
		:type="type"
	>
		<slot />
	</button>
</template>
<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";

const { mode } = defineProps({
	mode: {
		type: String,
		default: "default",
		validator: (s: string) => ["default", "remove-fill", "remove-border", "neutral-fill", "black-fill", "primary-fill"].includes(s),
	},
});

const attrs = useAttrs();

const type = computed(() => (attrs.type as ButtonHTMLAttributes["type"]) ?? "button");

const classesByMode = computed(() => {
	switch (mode) {
		case "remove-fill":
			return "text-white/80 bg-secondary-300";
		case "remove-border":
			return "border-1 border-solid border-secondary-400 text-secondary-500 bg-primary-100 transition hover:border-secondary-500 hover:text-secondary-600";
		case "neutral-fill":
			return "transition text-white/80 hover:text-white/90 hover:bg-neutral-400 bg-neutral-300";
		case "black-fill":
			return "transition text-white/80 hover:text-white/90 hover:bg-black/90 bg-black";
		case "primary-fill":
			return "transition hover:bg-primary-950 bg-primary-800 text-primary-200 text-14 font-bold";
		default:
			return "";
	}
});
</script>
