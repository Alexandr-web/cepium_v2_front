import type { TUserConfirmChangeSecurityData, TUserEditSecurityData } from "@/types/api";
import { useAuthStore } from "@/store/useAuthStore";

// изменение пароля
export const changePassword = async (body: TUserEditSecurityData) => {
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
export const confirmChangePassword = async (body: TUserConfirmChangeSecurityData) => {
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

// получение данных пользователя
export const getData = async () => {
	const token = useAuthStore().token;
	const res = await $fetch("/api/users/me", {
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
	});
	return res;
};
