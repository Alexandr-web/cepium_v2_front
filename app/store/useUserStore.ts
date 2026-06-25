import { defineStore } from "pinia";
import type { TUser } from "@/types/api";

export const useUserStore = defineStore("user-store", () => {
	const user = ref<TUser>({
		avatar: null,
		email: null,
	});

	const avatar = computed(() => user.value.avatar ?? "/images/profile/avatar.webp");

	// TODO добавить метод edit после появления бека для изменения данных пользователя

	return { user, avatar };
});
