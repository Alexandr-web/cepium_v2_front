<template>
	<div class="group flex items-center justify-between gap-10 rounded-8 lg:rounded-12 border-1 border-solid border-neutral-300 bg-primary-100 p-10 lg:p-16 cursor-pointer">
		<div class="flex items-center gap-10">
			<div v-show="item.logo" class="border-r-1 border-r-solid border-r-neutral-400 pr-12">
				<NuxtImg
					class="object-contain w-100 h-50"
					:src="item.logo"
					loading="lazy"
					:alt="item.name"
				/>
			</div>
			<div class="flex flex-col">
				<h3 class="group-hover:text-white text-white/80 transition font-medium lg:font-semibold text-14 lg:text-16 uppercase">{{ item.name }}</h3>
				<span
					class="text-12 lg:text-14"
					:class="[item.filled && 'text-tertiary-700', !item.filled && 'text-secondary-500']"
				>{{ item.prettyConnectedMessage }}</span>
			</div>
		</div>
		<IconAddRounded v-if="!item.filled" class="w-24 h-24 group-hover:text-white text-white/80 transition" />
		<IconEditOutlineRounded v-else class="w-24 h-24 group-hover:text-white text-white/80 transition" />
	</div>
</template>
<script setup lang="ts">
import IconAddRounded from "@/assets/icons/add-rounded.svg";
import IconEditOutlineRounded from "@/assets/icons/edit-outline-rounded.svg";
import type Exchange from "@/models/Exchange";

const { item } = defineProps<{ item: Exchange; }>();
</script>
