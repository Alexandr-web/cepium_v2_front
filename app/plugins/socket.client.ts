import { io, type Socket } from "socket.io-client";
import Trade from "@/models/Trade";
import { useAuthStore } from "@/store/useAuthStore";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useTradeStore } from "@/store/useTradeStore";

export default defineNuxtPlugin(() => {
	const router = useRouter();

	const connectionStore = useConnectionStore();
	const authStore = useAuthStore();
	const dashboardStore = useDashboardStore();
	const exchangeStore = useExchangeStore();
	const tradeStore = useTradeStore();

	const config = useRuntimeConfig();

	let socket: Socket|null = null;

	// общий payload для работы со всеми событиями
	const payload = computed(() => ({ exchangeName: exchangeStore.activeExchange }));

	// основные события
	const subscribeDeals = () => socket?.emit("subscribeDeals", payload.value);
	const unsubscribeDeals = () => socket?.emit("unsubscribeDeals", payload.value);
	const subscribeAccountInfo = () => socket?.emit("subscribeAccountInfo", payload.value);
	const unsubscribeAccountInfo = () => socket?.emit("unsubscribeAccountInfo", payload.value);

	const connectSocket = () => {
		if (socket) return;

		socket = io(config.public.wsUrl, {
			autoConnect: true,
			withCredentials: true,
			transports: ["websocket"],
			auth: (cb) => cb({ token: authStore.token }),
		});

		// системные события
		socket.on("connect", () => connectionStore.status = ConnectionStatuses.OPEN);
		socket.on("disconnect", () => connectionStore.status = ConnectionStatuses.CLOSED);
		socket.on("connect_error", () => connectionStore.status = ConnectionStatuses.CONNECTING);

		// активные сделки
		socket.on("deals", (data: TPosition[]) => {
			data.forEach((pos) => {
				const findPosIdx = tradeStore.trades.findIndex(({ symbol }) => symbol === pos.symbol);

				if (findPosIdx === -1) {
					tradeStore.trades.push(new Trade(pos));
					return;
				}

				if (pos.closedAt) {
					tradeStore.trades.splice(findPosIdx, 1);
					return;
				}

				tradeStore.trades[findPosIdx]?.updateData(pos);
			});
		});

		// информация на дашборде
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

		// обработка ошибок
		socket.on("accountInfoError", (data) => {
			const message = parseExchangeErrorMessage(data.message, exchangeStore.activeExchange ?? "");
			
			if (message) {
				push.error(message);
				console.error(data);
			}
		});
	};

	const disconnectSocket = () => {
		socket?.disconnect();
		socket = null;
	};

	router.afterEach((to) => {
		if (to.meta.hasSocket) connectSocket();
		else disconnectSocket();
	});

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
