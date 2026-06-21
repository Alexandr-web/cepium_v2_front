export default {
	// https://router.vuejs.org/api/interfaces/routeroptions#routes
	routes: () => [
		{
			name: "home",
			path: "/",
			component: () => import("@/pages/index.vue"),
			meta: {
				// middleware: "auth", отключаем до появления бека
				seo: {
					title: "Главная",
				},
			},
		},
		{
			name: "settings",
			path: "/settings",
			component: () => import("@/pages/settings.vue"),
			meta: {
				// middleware: "auth", отключаем до появления бека
				seo: {
					title: "Настройки",
				},
			},
		},
		{
			name: "profile",
			path: "/profile",
			component: () => import("@/pages/profile.vue"),
			meta: {
				// middleware: "auth", отключаем до появления бека
				seo: {
					title: "Профиль",
				},
			},
		},
		{
			name: "statistics",
			path: "/statistics",
			component: () => import("@/pages/statistics.vue"),
			meta: {
				// middleware: "auth", отключаем до появления бека
				seo: {
					title: "Статистика",
				},
			},
		},
		{
			name: "orders",
			path: "/orders",
			component: () => import("@/pages/orders.vue"),
			meta: {
				// middleware: "auth", отключаем до появления бека
				seo: {
					title: "История ордеров",
				},
			},
		},
		{
			name: "login",
			path: "/login",
			component: () => import("@/pages/login.vue"),
			meta: {
				// middleware: "login", отключаем до появления бека
				layout: false,
				seo: {
					title: "Вход",
				},
			},
		},
	],
};
