<template>
	<component
		:is="to ? NuxtLink : 'div'"
		v-bind="to ? { to } : undefined"
		class="inline-flex items-center text-20 lg:text-24 font-bold tracking-wider select-none group"
	>
		<span class="text-neutral-950 transition-colors group-hover:text-primary-800">bit</span>
		<span class="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent transition-all group-hover:brightness-125 ml-2 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-2 after:bg-primary-600 after:transition-all group-hover:after:w-full">
			rit
		</span>
		<span class="w-4 h-4 rounded-full bg-primary-600 ml-4 shadow-[0_0_8px_var(--color-primary-500)] animate-pulse" />
	</component>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";

defineProps({
	to: {
		type: [Object, String],
		default: "",
	},
});
</script>
