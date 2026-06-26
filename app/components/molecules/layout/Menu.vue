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
						<ClientOnly>
							<Icon
								:name="item.icon"
								:class="[
									preset === 'desk' && 'w-20 h-20 text-primary-700 group-hover:text-primary-800 transition',
									preset === 'mob' && 'w-20 h-20 text-primary-700'
								]"
							/>
						</ClientOnly>
						<span
							:class="[
								preset === 'desk' && 'group-hover:text-primary-800 text-primary-700 transition text-14',
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
				<ClientOnly>
					<Icon
						name="material-symbols:logout-rounded"
						:class="[
							preset === 'desk' && 'w-18 h-18',
							preset === 'mob' && 'w-18 h-18'
						]"
					/>
				</ClientOnly>
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
		icon: "material-symbols:home-outline-rounded",
	},
	{
		route: "settings",
		label: "Настройки",
		icon: "material-symbols:settings-outline",
	},
	{
		route: "statistics",
		label: "Статистика",
		icon: "material-symbols:monitoring",
	},
	{
		route: "orders",
		label: "Ордера",
		icon: "material-symbols:work-history-outline-rounded",
	},
	{
		route: "profile",
		label: "Профиль",
		icon: "material-symbols:person-outline-rounded",
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
