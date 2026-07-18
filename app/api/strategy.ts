import { useAuthStore } from "@/store/useAuthStore";

// получение стратегий
export const getData = async (): Promise<TStrategyDataResponse> => {
	const token = useAuthStore().token;
	const res = await $fetch("/api/strategies", {
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
	});
	return res;
};
