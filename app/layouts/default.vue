<template>
	<div class="flex flex-col bg-neutral-200 h-dvh max-h-dvh">
		<Header />
		<div class="flex grow min-h-0">
			<Menu class="hidden lg:flex" :preset="MenuPreset.DESKTOP" />
			<main class="flex flex-col grow relative isolate overflow-hidden">
				<div class="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
					<video
						class="w-full h-full object-cover"
						autoplay
						muted
						loop
						playsinline
					>
						<source src="/videos/bg-mob.mp4" type="video/mp4" media="(max-width: 768px)">
						<source src="/videos/bg-desk.mp4" type="video/mp4" media="(min-width: 769px)">
					</video>
					<div class="absolute inset-0 bg-black/90 backdrop-blur-md"/>
				</div>
				<div
					ref="content"
					class="grow flex flex-col max-w-full max-h-full scroll-block text-white p-16 overflow-auto"
				>
					<AButton
						v-if="!route.meta.noBack"
						class="flex lg:hidden items-center py-6 px-12 rounded-4 mr-auto mb-10"
						:mode="ButtonMode.NEUTRAL_FILL"
						@click="router.back()"
					>
						<IconArrowBack class="text-neutral-700 w-16 h-16" />
					</AButton>
					<NuxtPage />
				</div>
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
import { useUser } from "@/composables/api/useUser";

const { suspense } = useUser();

await suspense();

const route = useRoute();
const router = useRouter();

const showMobMenu = useState("show-mob-menu", () => false);

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
