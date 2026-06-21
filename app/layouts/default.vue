<template>
	<div class="flex flex-col bg-black h-screen max-h-screen">
		<Header />
		<div class="flex grow min-h-0">
			<Menu class="hidden lg:flex" preset="desk" />
			<main class="scroll-block grow text-white p-16 overflow-auto">
				<NuxtPage />
			</main>
		</div>
	</div>
</template>
<script setup lang="ts">
import Header from "@/components/molecules/layout/Header.vue";
import Menu from "@/components/molecules/layout/Menu.vue";
</script>
