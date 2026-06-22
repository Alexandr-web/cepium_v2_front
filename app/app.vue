<template>
	<NuxtLayout>
		<NuxtLoadingIndicator
			color="white"
			:height="3"
			:duration="2000"
		/>
		<NuxtPage />
	</NuxtLayout>
</template>
<script setup lang="ts">
const route = useRoute();

useHead({
	title: () => route.meta?.seo?.title ?? "",
});
</script>
