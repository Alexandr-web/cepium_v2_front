<template>
	<component
		:is="to ? NuxtLink : 'div'"
		v-bind="to ? { to } : undefined"
		class="uppercase font-medium text-20 lg:text-24 text-primary-800 select-none"
	>cepium</component>
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
