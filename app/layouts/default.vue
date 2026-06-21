<template>
	<div class="flex flex-col bg-black h-screen">
		<Header />
		<main class="grow text-white p-16">
			<NuxtPage />
		</main>
	</div>
</template>
<script setup lang="ts">
import Header from "@/components/molecules/layout/Header.vue";
</script>
