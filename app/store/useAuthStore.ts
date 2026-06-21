import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth-store", () => {
	const token = useCookie<string | null>("auth_token", {
		maxAge: 60 * 60 * 24 * 7, // 1 день
		watch: true,
	});

	const isAuthenticated = computed(() => !!token.value);

	return { token, isAuthenticated };
});
