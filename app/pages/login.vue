<template>
	<div class="flex flex-col h-screen bg-black relative z-1">
		<LazyOrganismsLoginForm />
		<NuxtImg
			class="hidden lg:block top-0 left-0 w-screen h-screen -z-1 absolute object-cover"
			src="/login/bg.webp"
			:preload="{ fetchPriority: 'high' }"
			alt=""
		/>
	</div>
</template>
<script setup lang="ts">
definePageMeta({
	middleware: (from, to) => {},
});
</script>
