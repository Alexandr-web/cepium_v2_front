<template>
	<div class="flex flex-col bg-neutral-100 h-dvh max-h-dvh relative isolate overflow-hidden">
		<div class="hidden lg:block pointer-events-none select-none fixed inset-0 -z-10 overflow-hidden">
			<div class="absolute -top-140 -left-80 w-500 h-500 rounded-full bg-primary-500/13 blur-[130px]" />
			<div class="absolute -top-180 left-[38%] w-520 h-400 rounded-full bg-tertiary-500/13 blur-[140px]" />
			<div class="absolute top-[45%] -left-160 w-450 h-450 rounded-full bg-secondary-500/13 blur-[140px]" />
			<div class="absolute -bottom-160 left-[120px] w-480 h-480 rounded-full bg-primary-400/13 blur-[150px]" />
		</div>
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
import { useCurrency } from "@/composables/api/useCurrency";

const { suspense: suspenseUser } = useUser();
const { suspense: suspenseCurrency } = useCurrency();

await Promise.all([suspenseUser(), suspenseCurrency()]);

const isDesktop = useMediaQuery("(min-width: 1024px)");

const route = useRoute();
const router = useRouter();

const showMobMenu = useState("show-mob-menu", () => false);

const theme: NotivueTheme = {
	...slateTheme,
	"--nv-global-bg": "var(--color-neutral-200)",
	"--nv-global-border": "var(--color-neutral-300)",
	"--nv-global-accent": "var(--color-neutral-200)",
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
