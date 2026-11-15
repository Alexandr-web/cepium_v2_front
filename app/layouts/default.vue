<template>
	<div class="flex flex-col bg-neutral-100 h-dvh max-h-dvh">
		<Header />
		<div class="flex grow min-h-0">
			<Menu class="hidden lg:flex" :preset="MenuPreset.DESKTOP" />
			<main class="flex flex-col grow min-w-0 relative isolate">
				<div
					ref="content"
					class="grow flex flex-col max-w-full max-h-full scroll-block text-white p-16 overflow-auto"
				>
					<AButton
						v-if="!route.meta.noBack"
						class="flex lg:hidden items-center py-6 px-12 rounded-6 mr-auto mb-10 border border-neutral-300"
						:mode="ButtonMode.NEUTRAL_FILL"
						@click="router.back()"
					>
						<IconArrowBack class="text-neutral-700 w-16 h-16" />
					</AButton>
					<slot />
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

const isDesktop = useMediaQuery("(min-width: 1024px)");

const route = useRoute();
const router = useRouter();

const showMobMenu = useState("show-mob-menu", () => false);

const theme: NotivueTheme = {
	...slateTheme,
	"--nv-global-bg": "var(--color-primary-100)",
	"--nv-global-border": "var(--color-primary-200)",
};

const content = useTemplateRef("content");

const scrollToTop = async () => {
	await nextTick();
	content.value?.scrollTo({ behavior: "smooth", top: 0 });
};

router.afterEach(async () => {
	if (!isDesktop.value) showMobMenu.value = false;
	push.destroyAll();
	await scrollToTop();
});
</script>
