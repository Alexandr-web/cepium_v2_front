import type { TAuthLoginResponse } from "@/types/api";
import type { FetchError } from "ofetch";
import { login } from "@/api/auth";
import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "@/store/useAuthStore";

export const useLogin = () => {
	const authStore = useAuthStore();
	const router = useRouter();

	const errMessage = ref("");

	const { mutate, isPending } = useMutation({
		mutationFn: login,
		onSuccess: (data: TAuthLoginResponse) => {
			const token = data.data?.token;

			if (token) {
				authStore.token = token;
				router.push({ name: "home" });
			}
		},
		onError: (err: FetchError) => {
			errMessage.value = getRequestErrorMessage(err);
		},
	});

	return { errMessage, mutate, isPending };
};
