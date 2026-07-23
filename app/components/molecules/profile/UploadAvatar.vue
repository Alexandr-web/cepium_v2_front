<template>
	<div class="flex items-center gap-28 py-35 px-28 lg:p-20 bg-neutral-100 rounded-8 border-1 border-solid border-white/5">
		<div
			class="flex justify-center items-center border-3 border-solid border-white/10 rounded-12 min-w-64 lg:min-w-120 max-w-64 lg:max-w-120 min-h-64 lg:min-h-120 max-h-64 lg:max-h-120 relative cursor-pointer"
			@click="() => open()"
		>
			<NuxtImg
				class="object-cover w-56 lg:w-110 h-56 lg:h-110 rounded-12"
				:src="getURLFile(fileModel)"
				:preload="{ fetchPriority: 'high' }"
				alt=""
			/>
			<div class="absolute bottom-0 right-0 translate-x-10 translate-y-10 rounded-8 p-5 flex justify-center items-center bg-primary-600 w-25 h-25">
				<IconEditOutlineRounded class="w-full h-full text-neutral-950" />
			</div>
		</div>
		<div class="flex flex-col">
			<h2 class="font-light text-14 lg:text-18 text-white truncate w-full">{{ userStore.user.name }}</h2>
			<h3 class="font-light text-14 lg:text-18 text-primary-800 truncate w-full">{{ userStore.user.email }}</h3>
		</div>
	</div>
</template>
<script setup lang="ts">
import IconEditOutlineRounded from "@/assets/icons/edit-outline-rounded.svg";
import { useUserStore } from "@/store/useUserStore";
import { useFileDialog } from "@vueuse/core";

const userStore = useUserStore();

const { open, onChange } = useFileDialog({
	accept: "image/jpg,image/jpeg,image/png,image/webp",
	multiple: false,
});

const fileModel = defineModel<File | null | string>({ default: null });

onChange((files) => {
	const file = Array.from(files ?? [])[0];
	if (!file) return;
	fileModel.value = file;
});
</script>
