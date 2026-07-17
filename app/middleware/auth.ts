import { useAuthStore } from "@/store/useAuthStore";
import { useUser } from "@/composables/api/useUser";

export default defineNuxtRouteMiddleware(async (to) => {
	const authStore = useAuthStore();

	if (!authStore.isAuthenticated && to.name !== "login") {
		return navigateTo("/login");
	}

	const { suspense } = useUser();

	await suspense();
});
