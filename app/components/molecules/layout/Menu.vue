<template>
	<div
		:class="[
			preset === 'desk' && 'flex flex-col justify-between gap-24 py-16 px-12 bg-neutral-100/60 border-r border-solid border-r-white/5 max-w-256 w-full transition-all',
			preset === 'mob' && 'flex flex-col gap-24 w-full'
		]"
	>
		<nav class="scroll-block overflow-auto" :class="[preset === 'desk' && 'grow', preset === 'mob' && 'max-h-350']">
			<ul class="flex flex-col" :class="[preset === 'desk' && 'gap-4', preset === 'mob' && 'gap-8']">
				<li v-for="item in menu" :key="item.route" :class="[preset === 'desk' && 'w-full']">
					<NuxtLink
						class="group flex items-center rounded-8 transition-all duration-200 text-14 text-neutral-600"
						:to="{ name: item.route }"
						:class="[
							preset === 'desk' && 'gap-12 p-10  hover:text-neutral-950 hover:bg-neutral-300/40',
							preset === 'mob' && 'gap-14 p-12'
						]"
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
		<div class="flex items-center justify-between pt-12 border-t border-solid border-t-white/5" :class="[preset === 'mob' && 'mt-16']">
			<AButton
				class="flex items-center gap-10 text-secondary-500 hover:text-secondary-600 active:scale-95 transition-all duration-150 group/btn"
				@click="logout"
			>
				<IconLogoutRounded class="w-18 h-18 transition-transform duration-200 group-hover/btn:-translate-x-2" />
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

const { preset } = defineProps({
	preset: {
		type: String,
		default: "mob",
		validator: (s: string) => ["mob", "desk"].includes(s),
	},
});

const authStore = useAuthStore();
const router = useRouter();

const menu = [
	{ route: "home", label: "Главная", icon: IconHomeOutlineRounded },
	{ route: "configs", label: "Настройки", icon: IconSettingsOutline },
	{ route: "statistics", label: "Статистика", icon: IconMonitoring },
	{ route: "orders", label: "Ордера", icon: IconWorkHistoryOutlineRounded },
	{ route: "profile", label: "Профиль", icon: IconPersonOutlineRounded },
];

const activeClass = computed(() => 
	preset === "desk"
		? "text-primary-700 bg-primary-300/50 font-semibold shadow-sm shadow-primary-500/5"
		: "text-white bg-primary-600/20 font-semibold border-l-2 border-solid border-primary-500 rounded-l-none pl-10"
);

const logout = () => {
	authStore.clearToken();
	router.go(0);
};
</script>
