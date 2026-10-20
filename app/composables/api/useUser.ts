import keys from "@/api/keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";
import { useUserStore } from "@/store/useUserStore";
import type { FetchError } from "ofetch";

export const useUser = () => {
	const { api } = useApi();
	const userStore = useUserStore();
	const query = useQuery<UserDataResponse>({
		queryKey: keys.getDataProfile,
		queryFn: () => api("/api/users/me"),
	});

	const suspense = async () => {
		await query.suspense();
		if (query.data.value?.data) {
			userStore.updateData(query.data.value?.data);
		}
	};

	return { ...query, suspense };
};

export const useChangeData = () => {
	const { api } = useApi();
	const userStore = useUserStore();
	const queryClient = useQueryClient();
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		UserEditGeneralDataResponse,
		FetchError,
		UserEditGeneralData,
		{ previousData?: UserEditGeneralDataResponse }
	>({
		mutationFn: (data) => {
			const formData = new FormData();

			Object.entries(data).forEach(([key, value]) => {
				if (key && value) formData.append(key, value);
			});

			return api("/api/users/me", {
				method: "PATCH",
				body: formData,
			});
		},
		onMutate: async (data) => {
			errMessage.value = "";

			await queryClient.cancelQueries({ queryKey: keys.getDataProfile });

			const previousData = queryClient.getQueryData<UserEditGeneralDataResponse>(keys.getDataProfile);
			queryClient.setQueryData(keys.getDataProfile, (old: UserEditGeneralDataResponse) => ({
				...old,
				data: {
					...old?.data,
					...({
						...data,
						avatar: data.avatar ?? old.data?.avatar,
					}),
				},
			}));

			if (data) {
				userStore.updateData({
					avatar: data.avatar instanceof File
						? URL.createObjectURL(data.avatar)
						: data.avatar,
					email: data.email ?? "",
					name: data.name ?? "",
					xApiKeyRegenerationAllowedAt: data.xApiKeyRegenerationAllowedAt ?? "",
				});
			}

			return { previousData };
		},
		onSuccess: (data) => {
			queryClient.setQueryData(keys.getDataProfile, data);
			push.success("Данные успешно изменены!");
		},
		onError: (err, _, context) => {
			errMessage.value = getRequestErrorMessage(err);
			queryClient.setQueryData(keys.getDataProfile, context?.previousData);
			push.error(errMessage.value);
		},
	});

	return { mutate, isPending, errMessage };
};

export const useChangePassword = (onSuccess?: () => void) => {
	const { api } = useApi();
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		UserChangePasswordResponse,
		FetchError,
		UserEditSecurityData
	>({
		mutationFn: (body) => api("/api/users/me/password/request-change", {
			method: "POST",
			body,
		}),
		onSuccess,
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
			push.error(errMessage.value);
		},
	});

	return { mutate, isPending, errMessage };
};

export const useConfirmChangePassword = (onSuccess?: () => void) => {
	const { api } = useApi();
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		UserConfirmChangePasswordResponse,
		FetchError,
		UserConfirmChangeSecurityData
	>({
		mutationFn: (body) => api("/api/users/me/password/confirm-change", {
			method: "POST",
			body,
		}),
		onSuccess: () => {
			push.success("Пароль успешно изменен! Войдите заново для дальнейшей работы");
			onSuccess?.();
		},
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
			push.error(errMessage.value);
		},
	});

	return { mutate, isPending, errMessage };
};
