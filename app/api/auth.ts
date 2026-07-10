import type { TAuthLoginData } from "@/types/api";

export const login = async (data: TAuthLoginData) => {
	const res = await $fetch("/api/auth/login", {
		method: "POST",
		body: data,
	});
	return res;
};
