export default {
	// https://router.vuejs.org/api/interfaces/routeroptions#routes
	routes: () => [
		{
			name: "home",
			path: "/",
			component: () => import("./pages/index.vue"),
		},
	],
};
