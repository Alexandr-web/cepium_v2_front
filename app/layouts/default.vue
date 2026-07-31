<template>
	<div class="flex flex-col bg-neutral-200 h-dvh max-h-dvh">
		<Header />
		<div class="flex grow min-h-0">
			<Menu class="hidden lg:flex" preset="desk" />
			<main ref="content" class="flex flex-col scroll-block grow text-white p-16 overflow-auto">
				<AButton
					v-if="route.meta.hasBack"
					class="flex lg:hidden items-center gap-5 py-6 px-12 rounded-4 mr-auto mb-10"
					mode="neutral-fill"
					@click="router.back()"
				>
					<IconArrowBack class="text-neutral-700 w-16 h-16" />
					<span>Назад</span>
				</AButton>
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
import AButton from "@/components/atoms/AButton.vue";
import IconArrowBack from "@/assets/icons/material-symbols-arrow-back.svg";
import { slateTheme, type NotivueTheme } from "notivue";

const route = useRoute();
const router = useRouter();

const showMobMenu = useState("show-mob-menu");

const theme: NotivueTheme = {
	...slateTheme,
	"--nv-global-bg": "var(--color-primary-100)",
	"--nv-global-border": "var(--color-primary-200)",
};

const content = useTemplateRef("content");

router.afterEach(async () => {
	await nextTick();
	content.value?.scrollTo({ behavior: "smooth", top: 0 });
	showMobMenu.value = false;
	push.destroyAll();
});
</script>
