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

	const socket = ref<Socket|null>(null);

	// общий payload для работы со всеми событиями
	const payload = computed(() => ({ exchangeName: exchangeStore.activeExchange }));

	// основные события
	const subscribeDeals = () => socket.value?.emit("subscribeDeals", payload.value);
	const unsubscribeDeals = () => socket.value?.emit("unsubscribeDeals", payload.value);
	const subscribeAccountInfo = () => socket.value?.emit("subscribeAccountInfo", payload.value);
	const unsubscribeAccountInfo = () => socket.value?.emit("unsubscribeAccountInfo", payload.value);

	const connectSocket = () => {
		if (socket.value) return;

		socket.value = io(undefined, {
			path: config.public.wsUrl,
			autoConnect: true,
			withCredentials: true,
			transports: ["websocket"],
			auth: (cb) => cb({ token: authStore.token }),
		});

		// системные события
		socket.value.on("connect", () => {
			connectionStore.errorMessage = "";
			connectionStore.status = ConnectionStatuses.OPEN;
		});
		
		socket.value.on("disconnect", () => {
			connectionStore.errorMessage = "";
			connectionStore.status = ConnectionStatuses.CLOSED;
		});

		socket.value.on("connect_error", () => {
			connectionStore.errorMessage = "";
			connectionStore.status = ConnectionStatuses.CONNECTING;
		});

		// активные сделки
		socket.value.on("deals", (data: TPosition[]) => {
			connectionStore.errorMessage = "";

			// удаляем позиции, если их нет в приходящих сделках
			tradeStore.trades = tradeStore.trades.filter((pos) => data.some(({ id }) => id === pos.id));

			data.forEach((pos) => {
				const findTrade = tradeStore.trades.find(({ id }) => id === pos.id);

				if (findTrade) findTrade.updateData(pos);
				else tradeStore.trades.push(new Trade(pos));
			});
		});

		// информация на дашборде
		socket.value.on("accountInfo", (data: TDashboard) => {
			connectionStore.errorMessage = "";

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
		socket.value.on("accountInfoError", (data) => {
			const message = parseExchangeErrorMessage(data.message, exchangeStore.activeExchange ?? "");
			
			if (message) {
				connectionStore.errorMessage = message;
				console.error(data);
			}
		});
	};

	const disconnectSocket = () => {
		connectionStore.errorMessage = "";

		socket.value?.disconnect();
		socket.value = null;
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
