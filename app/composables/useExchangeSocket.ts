import { io, type Socket } from "socket.io-client";
import Trade from "@/models/Trade";
import { useAuthStore } from "@/store/useAuthStore";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useTradeStore } from "@/store/useTradeStore";

// Composable для управления WebSocket-соединением.
export const useExchangeSocket = () => {
	const connectionStore = useConnectionStore();
	const authStore = useAuthStore();
	const dashboardStore = useDashboardStore();
	const tradeStore = useTradeStore();

	const socket = useState<Socket | null>("socket", () => null);
	const isLoadedTrades = useState<boolean>("isLoadedTrades", () => false); // получен первый пакет от "deals"

	const connectSocket = () => {
		if (socket.value) return;
	
		const config = useRuntimeConfig();
		const url = import.meta.env.DEV ? config.public.wsUrl : undefined;
		const path = import.meta.env.DEV ? "/exchanges/socket.io" : config.public.wsUrl;

		socket.value = io(url, {
			path,
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
			isLoadedTrades.value = true;
			connectionStore.status = ConnectionStatuses.CLOSED;
		});

		socket.value.on("connect_error", () => {
			isLoadedTrades.value = true;
			connectionStore.status = ConnectionStatuses.CONNECTING;
		});

		// активные сделки
		socket.value.on("deals", (data: Position[]) => {
			if (data.length) connectionStore.errorMessage = "";

			isLoadedTrades.value = true;

			// удаляем позиции, если их нет в приходящих сделках
			const incomingIds = new Set(data.map(({ id }) => id));

			tradeStore.tradesMap.forEach((trade) => {
				if (!incomingIds.has(trade.id)) {
					tradeStore.tradesMap.delete(trade.id);
				}
			});

			data.forEach((pos) => {
				const findTrade = tradeStore.getTradeById(pos.id);

				if (findTrade) findTrade.updateData(pos);
				else tradeStore.tradesMap.set(pos.id, new Trade(pos));
			});
		});

		// информация на дашборде
		socket.value.on("accountInfo", (data: Dashboard) => {
			connectionStore.errorMessage = "";

			Object.assign(dashboardStore.data, {
				activePositionsCount: data?.activePositionsCount ?? 0,
				availableMargin: data?.availableMargin ?? 0,
				balance: data?.balance ?? 0,
				balanceDailyChangePercent: (data?.balanceDailyChangePercent ?? 0) / 100,
				dailyGoalPNL: data?.dailyGoalPNL ?? 0,
				pnl24h: data?.pnl24h ?? 0,
				usedMargin: data?.usedMargin ?? 0,
			});
		});

		// обработка ошибок
		socket.value.on("accountInfoError", (data) => {
			const message = parseExchangeErrorMessage(data.message);

			isLoadedTrades.value = true;
			
			if (message && connectionStore.errorMessage !== message) {
				connectionStore.errorMessage = message;
				console.error(data);
			}
		});
	};

	const disconnectSocket = () => {
		connectionStore.errorMessage = "";

		socket.value?.off("deals");
		socket.value?.off("accountInfo");
		socket.value?.off("accountInfoError");

		socket.value?.disconnect();
		socket.value = null;
	};

	const subscribeDeals = () => {
		isLoadedTrades.value = false;
		socket.value?.emit("subscribeDeals");
	};

	const unsubscribeDeals = () => socket.value?.emit("unsubscribeDeals");
	const subscribeAccountInfo = () => socket.value?.emit("subscribeAccountInfo");
	const unsubscribeAccountInfo = () => socket.value?.emit("unsubscribeAccountInfo");

	return {
		isLoadedTrades,
		subscribeDeals,
		unsubscribeDeals,
		subscribeAccountInfo,
		unsubscribeAccountInfo,
		connectSocket,
		disconnectSocket,
	};
};
