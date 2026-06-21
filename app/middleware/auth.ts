import { useAuthStore } from "@/store/useAuthStore";

export default defineNuxtRouteMiddleware((to) => {
	const authStore = useAuthStore();

	if (!authStore.isAuthenticated && to.name !== "login") {
		return navigateTo("/login");
	}
});
