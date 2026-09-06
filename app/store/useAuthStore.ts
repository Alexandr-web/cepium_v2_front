export const useAuthStore = defineStore("auth-store", () => {
	const token = useCookie<string | null>("auth_token", {
		maxAge: 60 * 60 * 12, // 12 часов
		sameSite: "lax",
		watch: true,
	});

	const isAuthenticated = computed(() => !!token.value);

	const clearToken = () => token.value = null;

	return { isAuthenticated, token, clearToken };
});
