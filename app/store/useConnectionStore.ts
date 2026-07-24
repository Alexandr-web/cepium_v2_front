import { defineStore } from "pinia";

export const useConnectionStore = defineStore("connection-store", () => {
	const status = ref(TConnectionStatuses.OPEN); // до появления бека

	const statusText = computed(() => {
		switch (status.value) {
			case TConnectionStatuses.CONNECTING:
				return "Подключение";
			case TConnectionStatuses.OPEN:
				return "Подключено";
			case TConnectionStatuses.CLOSING:
				return "Отключение";
			case TConnectionStatuses.CLOSED:
				return "Отключено";
		}
	});

	// TODO добавить работу WebSocket после появления бек

	return { status, statusText };
});
