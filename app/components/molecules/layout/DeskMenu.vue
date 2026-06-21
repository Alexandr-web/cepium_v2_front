<template>
	<div class="flex flex-col justify-between gap-16 py-8 bg-neutral-100/50 border-r-1 border-solid border-r-white/5 max-w-256 w-full">
		<nav>
			<ul class="flex flex-col gap-10">
				<li v-for="item in appStore.menu" :key="item.route" class="w-full h-42">
					<NuxtLink
						class="group transition flex w-full h-full items-center gap-12 p-8"
						:to="{ name: item.route }"
						exact-active-class="hover:bg-neutral-300/50 bg-neutral-200/50 relative before:content-[''] before:absolute before:right-0 before:top-0 before:w-2 before:h-full before:bg-primary-700 hover:before:bg-primary-800 before:transition"
					>
						<Icon :name="item.icon" class="w-20 h-20 text-primary-700 group-hover:text-primary-800 transition" />
						<span class="group-hover:text-primary-800 text-primary-700 transition text-14">{{ item.label }}</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
		<div class="flex flex-col mx-16 px-8 pt-8 border-t-1 border-solid border-t-white/5">
			<p class="text-neutral-600 text-14 text-right">{{ VERSION }}</p>
		</div>
	</div>
</template>
<script setup lang="ts">
import { VERSION } from "#imports";
import { useAppStore } from "~/store/useAppStore";

const appStore = useAppStore();
</script>
