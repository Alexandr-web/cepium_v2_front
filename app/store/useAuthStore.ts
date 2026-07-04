import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth-store", () => {
	const token = useCookie<string | null>("auth_token", {
		maxAge: 60 * 60 * 12 * 7, // 12 часов
		watch: true,
	});

	const isAuthenticated = computed(() => !!token.value);

	const clearToken = () => token.value = null;

	return { isAuthenticated, token, clearToken };
});
