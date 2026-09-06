// авторизация
export const login = async (body: AuthLoginData): Promise<AuthLoginResponse> => 
	$fetch("/api/auth/login", {
		method: "POST",
		body,
	});
