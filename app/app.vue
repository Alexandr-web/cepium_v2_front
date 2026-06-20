<template>
	<div>
		<NuxtPage />
	</div>
</template>
<script setup lang="ts">
const route = useRoute();

useHead({
	title: route.meta?.seo?.title ?? "",
});
</script>
