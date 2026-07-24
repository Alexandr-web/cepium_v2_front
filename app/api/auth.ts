// авторизация
export const login = async (body: TAuthLoginData): Promise<TAuthLoginResponse> => 
	$fetch("/api/auth/login", {
		method: "POST",
		body,
	});
