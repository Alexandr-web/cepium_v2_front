export default {
	// https://router.vuejs.org/api/interfaces/routeroptions#routes
	routes: () => [
		{
			name: "home",
			path: "/",
			component: () => import("./pages/index.vue"),
			meta: {
				seo: {
					title: "Главная",
				},
			},
		},
		{
			name: "login",
			path: "/login",
			component: () => import("./pages/login.vue"),
			meta: {
				seo: {
					title: "Вход",
				},
			},
		},
	],
};
