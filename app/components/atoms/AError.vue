<template>
	<p v-if="message" class="text-14 lg:text-15 text-secondary-500">{{ message }}</p>
</template>
<script setup lang="ts">
withDefaults(
	defineProps<{ message?: string; }>(),
	{ message: "" }
);
</script>
