export const useConnectionStore = defineStore("connection-store", () => {
	const status = ref(ConnectionStatuses.NONE);
	const errorMessage = ref("");

	const statusText = computed(() => {
		switch (status.value) {
			case ConnectionStatuses.CONNECTING:
				return "Подключение";
			case ConnectionStatuses.OPEN:
				return "Подключено";
			case ConnectionStatuses.CLOSING:
				return "Отключение";
			default:
				return "Отключено";
		}
	});

	return { status, statusText, errorMessage };
});
