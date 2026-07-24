export default {
	// https://router.vuejs.org/api/interfaces/routeroptions#routes
	routes: () => [
		{
			name: "home",
			path: "/",
			component: () => import("@/pages/index.vue"),
			meta: {
				middleware: "auth",
				seo: {
					title: "Главная",
				},
			},
		},
		{
			name: "config",
			path: "/configs",
			children: [
				{
					name: "configs",
					path: "",
					component: () => import("@/pages/configs.vue"),
					meta: {
						middleware: "auth",
						seo: {
							title: "Доступные конфиги",
						},
					},
				},
				{
					name: "add-config",
					path: "add",
					component: () => import("@/pages/add-config.vue"),
					meta: {
						middleware: "auth",
						seo: {
							title: "Добавление конфига",
						},
					},
				},
			],
		},
		{
			name: "profile",
			path: "/profile",
			component: () => import("@/pages/profile.vue"),
			meta: {
				middleware: "auth",
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
				middleware: "auth",
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
				middleware: "auth",
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
				middleware: "login",
				layout: false,
				seo: {
					title: "Вход",
				},
			},
		},
	],
};
