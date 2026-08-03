import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useDashboardStore } from "@/store/useDashboardStore";

export default defineNuxtPlugin(() => {
	const connectionStore = useConnectionStore();
	const authStore = useAuthStore();
	const dashboardStore = useDashboardStore();

	const config = useRuntimeConfig();

	const socket = io(config.public.wsUrl, {
		autoConnect: true,
		withCredentials: true,
		transports: ["websocket"],
		auth: (cb) => cb({ token: authStore.token }),
	});

	socket.on("connect", () => connectionStore.status = ConnectionStatuses.OPEN);
	socket.on("disconnect", () => connectionStore.status = ConnectionStatuses.CLOSED);
	socket.on("connect_error", () => connectionStore.status = ConnectionStatuses.CONNECTING);

	socket.on("deals", (data) => console.log(data));

	socket.on("accountInfo", (data: TDashboard) => {
		dashboardStore.data = {
			activePositionsCount: data?.activePositionsCount ?? 0,
			availableMargin: data?.availableMargin ?? 0,
			balance: data?.balance ?? 0,
			balanceDailyChangePercent: (data?.balanceDailyChangePercent ?? 0) / 100,
			dailyGoalPNL: data?.dailyGoalPNL ?? 0,
			pnl24h: data?.pnl24h ?? 0,
			usedMargin: data?.usedMargin ?? 0,
		};
	});

	socket.on("accountInfoError", (data) => console.error(data));

	const subscribeDeals = () => {
		socket.emit("subscribeDeals", { exchangeName: "bybit" });
	};

	const unsubscribeDeals = () => {
		socket.emit("unsubscribeDeals", { exchangeName: "bybit" });
	};

	const subscribeAccountInfo = () => {
		socket.emit("subscribeAccountInfo", { exchangeName: "bybit" });
	};

	const unsubscribeAccountInfo = () => {
		socket.emit("unsubscribeAccountInfo", { exchangeName: "bybit" });
	};

	return {
		provide: {
			socket,
			events: {
				subscribeAccountInfo,
				unsubscribeAccountInfo,
				subscribeDeals,
				unsubscribeDeals,
			},
		},
	};
});
