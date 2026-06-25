import { useAuthStore } from "@/store/useAuthStore";

export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore();

	if (authStore.isAuthenticated && to.name === "login") {
		throw createError({ 
			status: 404, 
			message: "Страница не найдена",
			fatal: true,
		});
	}
});
