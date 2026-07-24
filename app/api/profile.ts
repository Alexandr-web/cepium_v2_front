// изменение пароля
export const changePassword = async (body: TUserEditSecurityData): Promise<TUserChangePasswordResponse> => 
	useNuxtApp().$api("/api/users/me/password/request-change", {
		method: "POST",
		body,
	});

// подтверждение изменения пароля
export const confirmChangePassword = async (body: TUserConfirmChangeSecurityData): Promise<TUserConfirmChangePasswordResponse> => 
	useNuxtApp().$api("/api/users/me/password/confirm-change", {
		method: "POST",
		body,
	});

// изменение данных пользователя
export const changeData = async (data: TUserEditGeneralData): Promise<TUserEditGeneralDataResponse> => {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (key && value) formData.append(key, value);
	});

	return useNuxtApp().$api("/api/users/me", {
		method: "PATCH",
		body: formData,
	});
};

// получение данных пользователя
export const getData = async (): Promise<TUserDataResponse> => useNuxtApp().$api("/api/users/me");
