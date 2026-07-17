// авторизация
export const login = async (body: TAuthLoginData): Promise<TAuthLoginResponse> => {
	const res = await $fetch("/api/auth/login", {
		method: "POST",
		body,
	});
	return res;
};
