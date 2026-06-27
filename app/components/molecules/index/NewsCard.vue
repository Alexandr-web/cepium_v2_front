<template>
	<div
		class="flex flex-col gap-5 p-12 bg-neutral-200 border-l-3 border-l-solid rounded-4"
		:class="[
			news.risk === 'low' && 'border-neutral-700',
			news.risk === 'moderate' && 'border-primary-700',
			news.risk === 'high' && 'border-secondary-700',
		]"
	>
		<div class="flex items-center gap-10 justify-between">
			<h3
				class="text-14 line-clamp-2"
				:class="[
					news.risk === 'low' && 'text-neutral-700',
					news.risk === 'moderate' && 'text-primary-700',
					news.risk === 'high' && 'text-secondary-700',
				]"
			>{{ news.title }}</h3>
			<span class="text-12 text-neutral-700">{{ news.prettyTime }}</span>
		</div>
		<p class="text-14 text-white font-medium line-clamp-3">{{ news.content }}</p>
	</div>
</template>
<script setup lang="ts">
import type News from "@/models/News";

defineProps<{ news: News; }>();
</script>
