import { useAuthStore } from "@/store/useAuthStore";

export const useApi = (baseURL?: string) => {
	const nuxtApp = useNuxtApp();
	const authStore = useAuthStore();
	const config = useRuntimeConfig();

	const serverBaseURL = import.meta.server ? config.apiUrl : undefined;

	const api = $fetch.create({
		baseURL: baseURL ?? serverBaseURL,
		credentials: "omit",
		onRequest({ options }) {
			const headers = new Headers(options.headers);
			headers.set("Authorization", `Bearer ${authStore.token ?? ""}`);
			options.headers = headers;
		},
		async onResponseError({ response }) {
			if (response.status !== 401 || !authStore.token) return;
			
			authStore.clearToken();

			/**
			 * Редирект на логин в контексте Nuxt.
			 * Нужен, потому что колбэк вызывается асинхронно и теряет контекст `nuxtApp`,
			 * из-за чего `navigateTo` может упасть (особенно при SSR).
			 */
			await nuxtApp.runWithContext(() =>
				navigateTo({ name: "login" }, { redirectCode: 302 })
			);
		},
	});

	return { api };
};
