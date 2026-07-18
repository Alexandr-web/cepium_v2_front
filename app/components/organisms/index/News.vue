<template>
	<section class="hidden lg:flex flex-col max-h-450 gap-16 w-250 border-1 border-solid border-white/5 rounded-8 bg-neutral-100 self-start sticky top-0">
		<div class="p-8 flex items-center gap-10 border-b-1 border-b-solid border-white/10 pb-10">
			<IconNewsmodeOutlineRounded class="w-20 h-20 text-primary-700" />
			<h3 class="text-16 text-neutral-800">Новости</h3>
		</div>
		<div class="scroll-block p-16 pt-8 flex flex-col gap-12 overflow-auto grow">
			<NewsCard v-for="item in news" :key="item.id" :news="item" />
		</div>
	</section>
</template>
<script setup lang="ts">
import type News from "@/models/News";
import IconNewsmodeOutlineRounded from "@/assets/icons/newsmode-outline-rounded.svg";
import NewsCard from "@/components/molecules/index/NewsCard.vue";

defineProps<{ news: News[] }>();
</script>
