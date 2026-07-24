import { defineStore } from "pinia";

export const useUserStore = defineStore("user-store",
	() => {
		const user = reactive<TUser>({
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

		const updateData = (data: TUser) => {
			(Object.keys(data) as (keyof TUser)[]).forEach((key) => {
				const value = data[key];
				if (key in user && value !== undefined) {
					user[key] = value;
				}
			});
		};

		return { user, avatar, updateData };
	},
	{
		persist: {
      		// @ts-expect-error typescript не может определить тип path
			paths: ["user"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
