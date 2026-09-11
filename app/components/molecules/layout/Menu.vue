<template>
	<div :class="menuClasses">
		<nav class="scroll-block overflow-auto" :class="navClasses">
			<ul class="flex flex-col" :class="listClasses">
				<li v-for="item in menu" :key="item.route" :class="[preset === MenuPreset.DESKTOP && 'w-full']">
					<NuxtLink
						class="group flex items-center rounded-8 transition-all duration-200 text-14 text-neutral-600"
						:to="{ name: item.route }"
						:class="linkClasses"
						:active-class="activeClass"
					>
						<component
							:is="item.icon"
							class="w-20 h-20 transition-transform duration-200 group-hover:scale-105"
						/>
						<span class="font-medium tracking-wide transition-colors duration-200">
							{{ item.label }}
						</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
		<div class="flex items-center justify-between pt-12 border-t border-solid border-t-white/5" :class="[preset === MenuPreset.MOBILE && 'mt-16']">
			<AButton
				class="flex items-center gap-10 text-secondary-500 hover:text-secondary-600 active:scale-95 transition-all duration-150 group/btn"
				@click="logout"
			>
				<IconLogoutRounded class="w-18 h-18" />
				<span class="text-14">Выйти</span>
			</AButton>
			<span class="text-neutral-500 font-mono text-12 tracking-wider select-none bg-neutral-200/40 px-6 py-2 rounded-4">
				{{ VERSION }}
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";
import IconHomeOutlineRounded from "@/assets/icons/home-outline-rounded.svg";
import IconSettingsOutline from "@/assets/icons/settings-outline.svg";
import IconMonitoring from "@/assets/icons/monitoring.svg";
import IconWorkHistoryOutlineRounded from "@/assets/icons/work-history-outline-rounded.svg";
import IconPersonOutlineRounded from "@/assets/icons/person-outline-rounded.svg";
import IconLogoutRounded from "@/assets/icons/logout-rounded.svg";
import { useAuthStore } from "@/store/useAuthStore";

const props = withDefaults(
	defineProps<{
		preset?: MenuPreset;
	}>(),
	{
		preset: MenuPreset.MOBILE,
	}
);

const authStore = useAuthStore();
const router = useRouter();

const menu = [
	{ route: "home", label: "Главная", icon: IconHomeOutlineRounded },
	{ route: "configs", label: "Настройки", icon: IconSettingsOutline },
	{ route: "statistics", label: "Статистика", icon: IconMonitoring },
	{ route: "orders", label: "Ордера", icon: IconWorkHistoryOutlineRounded },
	{ route: "profile", label: "Профиль", icon: IconPersonOutlineRounded },
];

const menuClasses = computed(() => {
	switch (props.preset) {
		case MenuPreset.DESKTOP:
			return "flex flex-col justify-between gap-24 py-16 px-12 bg-neutral-100/60 border-r border-solid border-r-white/5 max-w-256 w-full transition-all";
		case MenuPreset.MOBILE:
			return "flex flex-col gap-24 w-full";
		default:
			return "";
	}
});

const navClasses = computed(() => {
	switch (props.preset) {
		case MenuPreset.DESKTOP:
			return "grow";
		case MenuPreset.MOBILE:
			return "max-h-350";
		default:
			return "";
	}
});

const listClasses = computed(() => {
	switch (props.preset) {
		case MenuPreset.DESKTOP:
			return "gap-4";
		case MenuPreset.MOBILE:
			return "gap-8";
		default:
			return "";
	}
});

const linkClasses = computed(() => {
	switch (props.preset) {
		case MenuPreset.DESKTOP:
			return "gap-12 p-10 hover:text-neutral-950 hover:bg-neutral-300/40";
		case MenuPreset.MOBILE:
			return "gap-14 p-12";
		default:
			return "";
	}
});

const activeClass = computed(() => {
	switch (props.preset) {
		case MenuPreset.DESKTOP:
			return "text-primary-600 bg-primary-500/5 font-medium transition-colors duration-200";
		case MenuPreset.MOBILE:
			return "text-primary-700 bg-primary-500/5 font-medium transition-all duration-200";
		default:
			return "";
	}
});

const logout = () => {
	authStore.clearToken();
	router.go(0);
};
</script>
