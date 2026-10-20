import keys from "@/api/keys";
import type { FetchError } from "ofetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

export const useConfigs = () => {
	const { api } = useApi();

	return useQuery<ConfigsResponse>({
		queryKey: keys.getConfigs,
		queryFn: () => api("/api/configs/me"),
	});
};

export const useConfig = (_id: MaybeRefOrGetter<string>) => {
	const id = computed(() => toValue(_id));
	const { api } = useApi();

	return useQuery<ConfigByIdResponse>({
		queryKey: () => keys.getConfig(id.value),
		queryFn: () => api(`/api/configs/me/${id.value}`),
	});
};

export const useCreateOne = (onSuccess?: () => void) => {
	const { api } = useApi();
	const queryClient = useQueryClient();
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		ConfigCreateResponse,
		FetchError,
		{ body: ConfigData, exchangeName: string }
	>({
		mutationFn: ({ body, exchangeName }) => api(`/api/configs/me/exchanges/${exchangeName}`, {
			method: "POST",
			body,
		}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: keys.getConfigs });
			onSuccess?.();
		},
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
			push.error(errMessage.value);
		},
	});

	return { mutate, isPending, errMessage };
};

export const useChangeOne = (_id: MaybeRefOrGetter<string>, onSuccess?: () => void) => {
	const { api } = useApi();
	const queryClient = useQueryClient();
	const id = computed(() => toValue(_id));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		ConfigChangeResponse,
		FetchError,
		ConfigData
	>({
		mutationFn: (body) => api(`/api/configs/me/${id.value}`, {
			method: "PATCH",
			body,
		}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: keys.getConfigs });
			onSuccess?.();
		},
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
			push.error(errMessage.value);
		},
	});

	return { mutate, isPending, errMessage };
};
