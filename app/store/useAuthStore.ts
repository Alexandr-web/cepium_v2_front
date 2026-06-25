import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth-store", () => {
	const _token = useCookie<string | null>("auth_token", {
		maxAge: 60 * 60 * 12 * 7, // 12 часов
		watch: true,
	});

	const isAuthenticated = computed(() => !!_token.value);

	const clearToken = () => _token.value = null;
	const setToken = (val: string) => _token.value = val;

	return { isAuthenticated, setToken, clearToken };
});
