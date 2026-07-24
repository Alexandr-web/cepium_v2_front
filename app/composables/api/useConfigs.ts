import keys from "@/api/keys";
import { useQuery } from "@tanstack/vue-query";
import { getList, getOne } from "@/api/configs";

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
