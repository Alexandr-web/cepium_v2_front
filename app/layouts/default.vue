<template>
	<div class="flex flex-col bg-black h-screen max-h-screen">
		<Header />
		<div class="flex grow min-h-0">
			<DeskMenu class="hidden lg:flex" />
			<main class="grow text-white p-16 overflow-auto">
				<NuxtPage />
			</main>
		</div>
	</div>
</template>
<script setup lang="ts">
import Header from "@/components/molecules/layout/Header.vue";
import DeskMenu from "@/components/molecules/layout/DeskMenu.vue";
</script>
