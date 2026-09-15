<template>
	<div class="group flex items-center gap-20 lg:gap-24 p-16 lg:p-0 lg:pb-24 bg-neutral-100 lg:bg-transparent rounded-12 lg:rounded-0 border lg:border-none border-solid border-neutral-200">
		<div
			class="relative flex justify-center select-none items-center rounded-full bg-neutral-300/40 p-4 border border-solid border-neutral-200/60 cursor-pointer shrink-0 w-84 lg:w-144 h-84 lg:h-144"
			@click="open()"
		>
			<div class="w-full h-full rounded-full overflow-hidden">
				<AImage
					:src="getURLFile(fileModel)"
					fetchpriority="high"
					:preset="ImagePreset.AVATAR"
					:is-nuxt-img="false"
					alt=""
				/>
			</div>
			<div class="absolute -bottom-4 -right-4 rounded-8 p-6 flex justify-center items-center bg-primary-600 hover:bg-primary-700 active:scale-95 text-white w-24 h-24 shadow-sm shadow-primary-500/30 transition">
				<IconEditOutlineRounded class="w-14 h-14" />
			</div>
		</div>
		<div class="flex flex-col min-w-0 grow gap-2">
			<h2 class="font-bold lg:text-20 text-neutral-900 truncate tracking-tight" :title="name">
				{{ name }}
			</h2>
			<h3 class="font-medium text-13 lg:text-14 text-neutral-500 truncate" :title="email">
				{{ email }}
			</h3>
		</div>
	</div>
</template>

<script setup lang="ts">
import IconEditOutlineRounded from "@/assets/icons/edit-outline-rounded.svg";
import AImage from "@/components/atoms/AImage.vue";
import { useUserStore } from "@/store/useUserStore";

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

const name = computed(() => userStore.user.name ?? "-");
const email = computed(() => userStore.user.email ?? "-");
</script>
