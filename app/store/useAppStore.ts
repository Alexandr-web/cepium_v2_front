import { defineStore } from "pinia";

export const useAppStore = defineStore("app-store", () => {
	const menu = ref([
		{
			route: "home",
			label: "Главная",
			icon: "material-symbols:monitoring",
		},
		{
			route: "statistics",
			label: "Статистика",
			icon: "uil:statistics",
		},
		{
			route: "orders",
			label: "Ордера",
			icon: "tdesign:work-history",
		},
	]);

	return { menu };
});
