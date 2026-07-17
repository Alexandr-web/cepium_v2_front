import keys from "@/api/keys";
import { useUserStore } from "@/store/useUserStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getData, changeData, changePassword, confirmChangePassword } from "@/api/profile";
import type { FetchError } from "ofetch";

export const useUser = () => {
	const userStore = useUserStore();

	const query = useQuery({
		queryKey: keys.getDataProfile,
		queryFn: getData,
	});

	watch(
		() => query.data.value?.data,
		(v) => v && userStore.updateData(v),
		{ immediate: true }
	);

	return query;
};

export const useChangeData = () => {
	const queryClient = useQueryClient();
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TUserEditGeneralDataResponse,
		FetchError,
		TUserEditGeneralData,
		{ previousData?: TUserEditGeneralDataResponse }
	>({
		mutationFn: changeData,
		onMutate: async (data) => {
			errMessage.value = "";

			await queryClient.cancelQueries({ queryKey: keys.getDataProfile });

			const previousData = queryClient.getQueryData<TUserEditGeneralDataResponse>(keys.getDataProfile);

			queryClient.setQueryData(keys.getDataProfile, (old: TUserEditGeneralDataResponse) => ({
				...old,
				data: {
					...old?.data,
					...data,
					avatar: old?.data?.avatar,
				},
			}));

			return { previousData };
		},
		onSuccess: (data) => queryClient.setQueryData(keys.getDataProfile, data),
		onError: (err, _, context) => {
			errMessage.value = getRequestErrorMessage(err);
			queryClient.setQueryData(keys.getDataProfile, context?.previousData);
		},
	});

	return { mutate, isPending, errMessage };
};

export const useChangePassword = (onSuccess?: () => void) => {
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TUserChangePasswordResponse,
		FetchError,
		TUserEditSecurityData
	>({
		mutationFn: changePassword,
		onSuccess,
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
		},
	});

	return { mutate, isPending, errMessage };
};

export const useConfirmChangePassword = (onSuccess?: () => void) => {
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TUserConfirmChangePasswordResponse,
		FetchError,
		TUserConfirmChangeSecurityData
	>({
		mutationFn: confirmChangePassword,
		onSuccess,
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
		},
	});

	return { mutate, isPending, errMessage };
};
