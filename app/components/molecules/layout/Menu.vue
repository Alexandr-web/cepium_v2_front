<template>
	<div
		:class="[
			preset === 'desk' && 'flex flex-col justify-between gap-16 py-8 bg-neutral-100/50 border-r-1 border-solid border-r-white/5 max-w-256 w-full',
			preset === 'mob' && 'flex flex-col gap-36'
		]"
	>
		<nav
			:class="[
				preset === 'mob' && 'scroll-block max-h-350 overflow-auto',
				preset === 'desk' && 'scroll-block grow overflow-auto'
			]">
			<ul
				:class="[
					preset === 'desk' && 'flex flex-col gap-10',
					preset === 'mob' && 'flex flex-col gap-16'
				]"
			>
				<li
					v-for="item in menu"
					:key="item.route"
					:class="[
						preset === 'desk' && 'w-full h-42'
					]"
				>
					<NuxtLink
						:class="[
							preset === 'desk' && 'group transition flex w-full h-full items-center gap-12 p-8',
							preset === 'mob' && 'flex items-center gap-16'
						]"
						:to="{ name: item.route }"
						:exact-active-class="activeClass"
						@click="emits('clickByLink')"
					>
						<component
							:is="item.icon"
							:class="[
								preset === 'desk' && 'w-20 h-20 text-primary-700 group-hover:text-primary-800 transition',
								preset === 'mob' && 'w-20 h-20 text-primary-700'
							]"
						/>
						<span
							:class="[
								preset === 'desk' && 'group-hover:text-neutral-950 text-neutral-800 transition text-14',
								preset === 'mob' && 'text-white/80 font-medium text-14'
							]"
						>{{ item.label }}</span>
					</NuxtLink>
				</li>
			</ul>
		</nav>
		<div
			:class="[
				preset === 'desk' && 'flex items-center justify-between px-8 pt-8 border-t-1 border-solid border-t-white/5',
				preset === 'mob' && 'flex items-center justify-between pt-8 border-t-1 border-solid border-t-white/5'
			]"
		>
			<AButton
				:class="[
					preset === 'desk' && 'hover:text-secondary-600 transition text-secondary-500 flex gap-12 items-center',
					preset === 'mob' && 'hover:text-secondary-600 transition text-secondary-500 flex gap-12 items-center'
				]"
				@click="logout"
			>
				<IconLogoutRounded
					:class="[
						preset === 'desk' && 'w-18 h-18',
						preset === 'mob' && 'w-18 h-18'
					]"
				/>
				<span 
					:class="[
						preset === 'desk' && 'text-14 font-medium',
						preset === 'mob' && 'text-14 font-medium',
					]"
				>Выйти</span>
			</AButton>
			<span
				:class="[
					preset === 'desk' && 'text-neutral-600 text-14',
					preset === 'mob' && 'text-neutral-600 text-14',
				]"
			>{{ VERSION }}</span>
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

const emits = defineEmits(["clickByLink"]);

const menu = [
	{
		route: "home",
		label: "Главная",
		icon: IconHomeOutlineRounded,
	},
	{
		route: "configs",
		label: "Настройки",
		icon: IconSettingsOutline,
	},
	{
		route: "statistics",
		label: "Статистика",
		icon: IconMonitoring,
	},
	{
		route: "orders",
		label: "Ордера",
		icon: IconWorkHistoryOutlineRounded,
	},
	{
		route: "profile",
		label: "Профиль",
		icon: IconPersonOutlineRounded,
	},
];

const activeClass = computed(() => 
	preset === "desk"
		? "hover:bg-neutral-300/50 bg-neutral-200/50 relative before:content-[''] before:absolute before:right-0 before:top-0 before:w-2 before:h-full before:bg-primary-700 hover:before:bg-primary-800 before:transition"
		: ""
);

const logout = () => {
	authStore.clearToken();
	router.go(0);
};
</script>
