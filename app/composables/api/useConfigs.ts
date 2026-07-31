import keys from "@/api/keys";
import type { FetchError } from "ofetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { changeOne, createOne, getList, getOne } from "@/api/configs";

export const useConfigs = () => {
	return useQuery({
		queryKey: keys.getConfigs,
		queryFn: getList,
	});
};

export const useConfig = (_id: MaybeRefOrGetter<string>) => {
	const id = computed(() => toValue(_id));

	return useQuery({
		queryKey: computed(() => keys.getConfig(id.value)),
		queryFn: () => getOne(id.value),
	});
};

export const useCreateOne = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TConfigCreateResponse,
		FetchError,
		{ body: TConfigData, exchangeName: string }
	>({
		mutationFn: ({ body, exchangeName }) => createOne(exchangeName, body),
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
	const queryClient = useQueryClient();
	const id = computed(() => toValue(_id));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TConfigChangeResponse,
		FetchError,
		TConfigData
	>({
		mutationFn: (body) => changeOne(id.value, body),
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
