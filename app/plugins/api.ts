import { useAuthStore } from "@/store/useAuthStore";

export default defineNuxtPlugin(() => {
	const authStore = useAuthStore();

	const api = $fetch.create({
		onRequest({ options }) {
			const headers = new Headers(options.headers);
			headers.set("Authorization", `Bearer ${authStore.token ?? ""}`);
			options.headers = headers;
		},
		onResponseError({ response }) {
			if (response.status === 401) {
				authStore.clearToken();
				navigateTo({ name: "login" });
			}
		},
	});

	return { provide: { api } };
});
