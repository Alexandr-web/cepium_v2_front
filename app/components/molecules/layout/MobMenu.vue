<template>
	<nav>
		<ul class="flex flex-col gap-16">
			<li v-for="item in appStore.menu" :key="item.route">
				<NuxtLink
					data-allow-mismatch="children"
					class="flex items-center gap-16" :to="{ name: item.route }"
					@click="emits('clickByLink')"
				>
					<Icon :name="item.icon" class="w-25 h-25 text-primary-700" />
					<p class="text-neutral-900 font-semibold">{{ item.label }}</p>
				</NuxtLink>
			</li>
		</ul>
	</nav>
</template>
<script setup lang="ts">
import { useAppStore } from "@/store/useAppStore";

const appStore = useAppStore();

const emits = defineEmits(["clickByLink"]);
</script>
