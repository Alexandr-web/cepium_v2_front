import type { FetchError } from "ofetch";
import { login } from "@/api/auth";
import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
	const authStore = useAuthStore();
	const router = useRouter();

	const errMessage = ref("");

	const { mutateAsync, isPending } = useMutation({
		mutationFn: login,
		onSuccess: async (data: AuthLoginResponse) => {
			const token = data.data?.token;

			if (token) {
				authStore.token = token;
				await router.push({ name: "home" });
			}
		},
		onError: (err: FetchError) => {
			errMessage.value = getRequestErrorMessage(err);
		},
	});

	return { errMessage, mutateAsync, isPending };
};
