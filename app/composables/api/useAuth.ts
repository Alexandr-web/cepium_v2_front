import type { FetchError } from "ofetch";
import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useApi } from "@/composables/useApi";

export const useLogin = () => {
	const authStore = useAuthStore();
	const router = useRouter();

	const { api } = useApi();

	const errMessage = ref("");

	const { mutateAsync, isPending } = useMutation<AuthLoginResponse, FetchError, AuthLoginData>({
		mutationFn: (body) => api("/api/auth/login", {
			method: "POST",
			body,
		}),
		onSuccess: async (data) => {
			const token = data.data?.token;

			if (token) {
				authStore.token = token;
				await router.push({ name: "home" });
			}
		},
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
		},
	});

	return { errMessage, mutateAsync, isPending };
};
