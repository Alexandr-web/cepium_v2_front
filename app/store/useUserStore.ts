export const useUserStore = defineStore("user-store", () => {
	const user = useLocalStorage<User>("user-store/user", {
		avatar: null,
		email: null,
		name: null,
		xApiKeyRegenerationAllowedAt: null,
	});

	const config = useRuntimeConfig();
	const avatar = computed(() => {
		if (user.value.avatar?.startsWith("blob:")) return user.value.avatar;
		return `${config.public.apiUrl}/users/me/avatars/${user.value.avatar || ""}`;
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
