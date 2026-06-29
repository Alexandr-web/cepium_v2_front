<template>
	<section class="flex items-center gap-28 py-35 px-28 bg-neutral-100 rounded-8 border-1 border-solid border-white/5">
		<div class="flex justify-center items-center border-3 border-solid border-white/10 rounded-12 p-2 min-w-64 max-w-64 min-h-64 max-h-64">
			<NuxtImg
				class="object-cover w-full h-full rounded-12"
				:src="userStore.avatar"
				:preload="{ fetchPriority: 'high' }"
				alt=""
			/>
		</div>
		<h2 class="font-light text-14 text-white truncate w-full">{{ userStore.user.email }}</h2>
	</section>
</template>
<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";

const userStore = useUserStore();
</script>
