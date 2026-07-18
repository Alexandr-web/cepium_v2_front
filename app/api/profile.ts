import { useAuthStore } from "@/store/useAuthStore";
import { FetchError } from "ofetch";

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
	const authStore = useAuthStore();
	const router = useRouter();
	const token = authStore.token;

	try {
		const res = await $fetch("/api/users/me", {
			headers: {
				Authorization: `Bearer ${token ?? ""}`,
			},
		});
		return res;
	} catch (err) {
		if (err instanceof FetchError && err.data.statusCode === 401) {
			authStore.clearToken();
			router.go(0);
		}

		return {};
	}
};
