import { useAuthStore } from "@/store/useAuthStore";

export const useApi = () => {
	const authStore = useAuthStore();

	const api = $fetch.create({
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
