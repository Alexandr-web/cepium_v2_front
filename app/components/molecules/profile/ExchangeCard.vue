<template>
	<div class="flex flex-col gap-10 rounded-8">
		<NuxtImg
			class="object-contain w-100 h-50"
			:src="item.logo"
			loading="lazy"
			:alt="item.name"
		/>
	</div>
</template>
<script setup lang="ts">
import type Exchange from "@/models/Exchange";

const { item } = defineProps<{ item: Exchange; }>();
</script>
