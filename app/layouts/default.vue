<template>
	<div class="flex flex-col bg-neutral-200 h-dvh max-h-dvh">
		<Header />
		<div class="flex grow min-h-0">
			<Menu class="hidden lg:flex" preset="desk" />
			<main ref="content" class="flex flex-col scroll-block grow text-white p-16 overflow-auto">
				<NuxtPage />
			</main>
		</div>
		<Notivue v-slot="item">
			<NotivueSwipe :item="item">
				<Notification :item="item" :theme="theme" />
			</NotivueSwipe>
		</Notivue>
	</div>
</template>
<script setup lang="ts">
import Header from "@/components/molecules/layout/Header.vue";
import Menu from "@/components/molecules/layout/Menu.vue";
import { slateTheme, type NotivueTheme } from "notivue";

const theme: NotivueTheme = {
	...slateTheme,
	"--nv-global-bg": "var(--color-primary-100)",
	"--nv-global-border": "var(--color-primary-200)",
};

const router = useRouter();

const content = useTemplateRef("content");

router.afterEach(async () => {
	await nextTick();
	content.value?.scrollTo({ behavior: "smooth", top: 0 });
	push.destroyAll();
});
</script>
