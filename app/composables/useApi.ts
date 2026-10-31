import { useAuthStore } from "@/store/useAuthStore";

export const useApi = (baseURL?: string) => {
	const authStore = useAuthStore();
	const config = useRuntimeConfig();

	const serverBaseURL = import.meta.server ? config.apiUrl : undefined;

	const api = $fetch.create({
		baseURL: baseURL ?? serverBaseURL,
		onRequest({ options }) {
			const headers = new Headers(options.headers);
			headers.set("Authorization", `Bearer ${authStore.token ?? ""}`);
			options.headers = headers;
		},
		async onResponseError({ response }) {
			if (response.status === 401) {
				authStore.clearToken();
				await navigateTo({ name: "login" });
			}
		},
	});

	return { api };
};
