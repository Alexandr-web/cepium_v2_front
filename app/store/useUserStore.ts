import { defineStore } from "pinia";

export const useUserStore = defineStore("user-store", () => {
	const user = ref<User>({
		avatar: null,
		email: null,
		name: null,
		xApiKeyRegenerationAllowedAt: null,
	});

	const config = useRuntimeConfig();
	const apiUrl = import.meta.dev ? config.public.apiUrl.dev : config.public.apiUrl.prod;

	const avatar = computed(() => {
		if (user.value.avatar?.includes("blob:")) {
			return user.value.avatar;
		}

		if (typeof user.value.avatar === "string") {
			return `${apiUrl}/users/me/avatars/${user.value.avatar}`;
		}

		return "";
	});

	const updateData = (data: User) => {
		Object.keys(data).forEach((key) => {
			if (!hasKey(data, key)) return;

			const value = data[key];
			if (value !== undefined) user.value[key] = value;
		});
	};

	return { user, avatar, updateData };
});
