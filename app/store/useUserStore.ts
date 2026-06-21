import { defineStore } from "pinia";
import type { TUser } from "~/types";

export const useUserStore = defineStore("user-store", () => {
	const user = ref<TUser>({
		avatar: null,
		name: null,
	});

	const avatar = computed(() => user.value.avatar ?? "/images/profile/avatar.webp");

	return { user, avatar };
});
