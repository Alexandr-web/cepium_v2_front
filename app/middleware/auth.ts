import { useAuthStore } from "@/store/useAuthStore";

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();

	if (!authStore.isAuthenticated && to.name !== "login") {
		return navigateTo("/login");
	}
});
