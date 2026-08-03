import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useExchangeStore } from "@/store/useExchangeStore";

export default defineNuxtPlugin(() => {
	const connectionStore = useConnectionStore();
	const authStore = useAuthStore();
	const dashboardStore = useDashboardStore();
	const exchangeStore = useExchangeStore();

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

	socket.on("accountInfoError", (data) => {
		if (typeof data.message === "string") push.error(data.message);
		console.error(data);
	});

	const payload = { exchangeName: exchangeStore.activeExchange };

	const subscribeDeals = () => socket.emit("subscribeDeals", payload);
	const unsubscribeDeals = () => socket.emit("unsubscribeDeals", payload);
	const subscribeAccountInfo = () => socket.emit("subscribeAccountInfo", payload);
	const unsubscribeAccountInfo = () => socket.emit("unsubscribeAccountInfo", payload);

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
