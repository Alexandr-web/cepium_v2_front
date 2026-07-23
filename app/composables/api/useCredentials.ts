import keys from "@/api/keys";
import type { FetchError } from "ofetch";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { getData, createData, changeData } from "@/api/credentials";

type TUseCredentialsOptions = {
	query: { exchangeName: MaybeRefOrGetter<string> };
	enabled?: MaybeRefOrGetter<boolean>;
};

export const useCredentials = (options: TUseCredentialsOptions) => {
	const exchangeName = computed(() => toValue(options.query.exchangeName));

	return useQuery({
		queryKey: computed(() => keys.getCredentials(exchangeName.value)),
		queryFn: () => getData({ query: { exchangeName: exchangeName.value } }),
		enabled: options.enabled,
	});
};

export const useCreateData = (_exchangeName: MaybeRefOrGetter<string>, onSuccess?: () => void) => {
	const exchangeName = computed(() => toValue(_exchangeName));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TCreateExchangeCredentialsResponse,
		FetchError,
		TExchangeCredentials
	>({
		mutationFn: (body) => createData(body, exchangeName.value),
		onSuccess,
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
		},
	});

	return { mutate, isPending, errMessage };
};

export const useChangeData = (_exchangeName: MaybeRefOrGetter<string>, onSuccess?: () => void) => {
	const exchangeName = computed(() => toValue(_exchangeName));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		TChangeExchangeCredentialsResponse,
		FetchError,
		TExchangeCredentials
	>({
		mutationFn: (body) => changeData(body, exchangeName.value),
		onSuccess,
		onError: (err) => {
			errMessage.value = getRequestErrorMessage(err);
		},
	});

	return { mutate, isPending, errMessage };
};
