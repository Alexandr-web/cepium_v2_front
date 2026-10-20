import keys from "@/api/keys";
import type { FetchError } from "ofetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { useApi } from "@/composables/useApi";

type UseCredentialsOptions = {
	query: { exchangeName: MaybeRefOrGetter<string> };
	enabled?: MaybeRefOrGetter<boolean>;
};

export const useCredentials = (options: UseCredentialsOptions) => {
	const { api } = useApi();
	const exchangeName = computed(() => toValue(options.query.exchangeName));

	return useQuery<ExchangeCredentialsResponse>({
		queryKey: computed(() => keys.getCredentials(exchangeName.value)),
		queryFn: () => api("/api/credentials", { query: { exchangeName: exchangeName.value } }),
		enabled: options.enabled,
	});
};

export const useCreateData = (_exchangeName: MaybeRefOrGetter<string>, onSuccess?: () => void) => {
	const { api } = useApi();
	const queryClient = useQueryClient();
	const exchangeName = computed(() => toValue(_exchangeName));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		CreateExchangeCredentialsResponse,
		FetchError,
		ExchangeCredentials
	>({
		mutationFn: (body) => api(`/api/credentials/${exchangeName.value}`, {
			method: "POST",
			body,
		}),
		onSuccess: () => {
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: keys.getExchanges });
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
	const { api } = useApi();
	const queryClient = useQueryClient();
	const exchangeName = computed(() => toValue(_exchangeName));
	const errMessage = ref("");

	const { mutate, isPending } = useMutation<
		ChangeExchangeCredentialsResponse,
		FetchError,
		ExchangeCredentials
	>({
		mutationFn: (body) => api(`/api/credentials/${exchangeName.value}`, {
			method: "PATCH",
			body,
		}),
		onSuccess: () => {
			onSuccess?.();
			queryClient.invalidateQueries({ queryKey: keys.getExchanges });
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
