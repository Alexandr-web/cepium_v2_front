import type { TUserChangePasswordResponse, TUserConfirmChangePasswordResponse, TUserConfirmChangeSecurityData, TUserDataResponse, TUserEditGeneralData, TUserEditGeneralDataResponse, TUserEditSecurityData } from "@/types/api";
import { useAuthStore } from "@/store/useAuthStore";

// изменение пароля
export const changePassword = async (body: TUserEditSecurityData): Promise<TUserChangePasswordResponse> => {
	const token = useAuthStore().token;
	const res = await $fetch("/api/users/me/password/request-change", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
		body,
	});
	return res;
};

// подтверждение изменения пароля
export const confirmChangePassword = async (body: TUserConfirmChangeSecurityData): Promise<TUserConfirmChangePasswordResponse> => {
	const token = useAuthStore().token;
	const res = await $fetch("/api/users/me/password/confirm-change", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
		body,
	});
	return res;
};

// изменение данных пользователя
export const changeData = async (data: TUserEditGeneralData): Promise<TUserEditGeneralDataResponse> => {
	const token = useAuthStore().token;
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (key) formData.append(key, value);
	});

	const res = await $fetch("/api/users/me", {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
		body: formData,
	});

	return res;
};

// получение данных пользователя
export const getData = async (): Promise<TUserDataResponse> => {
	const token = useAuthStore().token;
	const res = await $fetch("/api/users/me", {
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
	});
	return res;
};
