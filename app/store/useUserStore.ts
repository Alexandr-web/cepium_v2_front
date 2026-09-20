export const useUserStore = defineStore("user-store",
	() => {
		const user = reactive<User>({
			avatar: null,
			email: null,
			name: null,
			xApiKeyRegenerationAllowedAt: null,
		});

		const config = useRuntimeConfig();
		const avatar = computed(() => {
			if (user.avatar?.startsWith("blob:")) return user.avatar;
			return `${config.public.apiUrl}/users/me/avatars/${user.avatar || ""}`;
		});

		const updateData = (data: User) => {
			Object.keys(data).forEach((key) => {
				if (!hasKey(data, key)) return;

				const value = data[key];
				if (value !== undefined) user[key] = value;
			});
		};

		return { user, avatar, updateData };
	},
	{
		persist: {
			pick: ["user"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
