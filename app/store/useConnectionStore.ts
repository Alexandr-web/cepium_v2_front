import { defineStore } from "pinia";
import { useDashboardStore } from "@/store/useDashboardStore";

export const useConnectionStore = defineStore("connection-store", () => {
	const dashboardStore = useDashboardStore();

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

	const subscribeDeals = () => {
		const { $socket } = useNuxtApp();

		$socket.emit("subscribeDeals", { exchangeName: "bybit" });

		$socket.on("deals", (data) => console.log(data));
	};

	const unsubscribeDeals = () => {
		const { $socket } = useNuxtApp();

		$socket.emit("unsubscribeDeals", { exchangeName: "bybit" });
	};

	const subscribeAccountInfo = () => {
		const { $socket } = useNuxtApp();

		$socket.emit("subscribeAccountInfo", { exchangeName: "bybit" });

		$socket.on("accountInfo", (data: TDashboard) => {
			dashboardStore.data = {
				activePositionsCount: data?.activePositionsCount ?? 0,
				availableMargin: data?.availableMargin ?? 0,
				balance: data?.balance ?? 0,
				balanceDailyChangePercent: data?.balanceDailyChangePercent ?? 0,
				dailyGoalPNL: data?.dailyGoalPNL ?? 0,
				pnl24h: data?.pnl24h ?? 0,
				usedMargin: data?.usedMargin ?? 0,
			};
		});

		$socket.on("accountInfoError", (data) => console.error(data));
	};

	const unsubscribeAccountInfo = () => {
		const { $socket } = useNuxtApp();

		$socket.emit("unsubscribeAccountInfo", { exchangeName: "bybit" });
	};

	return {
		status,
		statusText,
		subscribeAccountInfo,
		unsubscribeAccountInfo,
		subscribeDeals,
		unsubscribeDeals,
	};
});
