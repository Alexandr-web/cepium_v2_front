import keys from "@/api/keys";
import type { FetchError } from "ofetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getData, createData, changeData } from "@/api/credentials";

type UseCredentialsOptions = {
	query: { exchangeName: MaybeRefOrGetter<string> };
	enabled?: MaybeRefOrGetter<boolean>;
};

export const useCredentials = (options: UseCredentialsOptions) => {
	const exchangeName = computed(() => toValue(options.query.exchangeName));

	return useQuery({
		queryKey: computed(() => keys.getCredentials(exchangeName.value)),
		queryFn: () => getData({ query: { exchangeName: exchangeName.value } }),
		enabled: options.enabled,
	});
};

export const useCreateData = (_exchangeName: MaybeRefOrGetter<string>, onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	const exchangeName = computed(() => toValue(_exchangeName));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		CreateExchangeCredentialsResponse,
		FetchError,
		ExchangeCredentials
	>({
		mutationFn: (body) => createData(body, exchangeName.value),
		onSuccess: () => {
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: keys.geExchanges });
			queryClient.invalidateQueries({ queryKey: keys.getCredentials(exchangeName.value) });
			push.success(`Данные для биржи ${exchangeName.value} успешно добавлены!`);
		},
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
			push.error(errMessage.value);
		},
	});

	return { mutate, isPending, errMessage };
};

export const useChangeData = (_exchangeName: MaybeRefOrGetter<string>, onSuccess?: () => void) => {
	const queryClient = useQueryClient();
	const exchangeName = computed(() => toValue(_exchangeName));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		ChangeExchangeCredentialsResponse,
		FetchError,
		ExchangeCredentials
	>({
		mutationFn: (body) => changeData(body, exchangeName.value),
		onSuccess: () => {
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: keys.geExchanges });
			queryClient.invalidateQueries({ queryKey: keys.getCredentials(exchangeName.value) });
			push.success(`Данные для биржи ${exchangeName.value} успешно изменены!`);
		},
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
			push.error(errMessage.value);
		},
	});

	return { mutate, isPending, errMessage };
};
