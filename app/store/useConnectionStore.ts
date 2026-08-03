import { defineStore } from "pinia";

export const useConnectionStore = defineStore("connection-store", () => {
	const status = ref(ConnectionStatuses.NONE);

	const statusText = computed(() => {
		switch (status.value) {
			case ConnectionStatuses.CONNECTING:
				return "Подключение";
			case ConnectionStatuses.OPEN:
				return "Подключено";
			case ConnectionStatuses.CLOSING:
				return "Отключение";
			case ConnectionStatuses.CLOSED:
				return "Отключено";
			default:
				return "";
		}
	});

	return { status, statusText };
});
