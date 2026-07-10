import type { TAuthLoginData } from "@/types/api";

// авторизация
export const login = async (body: TAuthLoginData) => {
	const res = await $fetch("/api/auth/login", {
		method: "POST",
		body,
	});
	return res;
};
