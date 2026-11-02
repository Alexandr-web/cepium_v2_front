import { io, type Socket } from "socket.io-client";
import Trade from "@/models/Trade";
import { useAuthStore } from "@/store/useAuthStore";
import { useConnectionStore } from "@/store/useConnectionStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useTradeStore } from "@/store/useTradeStore";

type Topic = "Deals" | "AccountInfo";

// Composable для управления WebSocket-соединением.
export const useExchangeSocket = () => {
	const config = useRuntimeConfig();
	const connectionStore = useConnectionStore();
	const authStore = useAuthStore();
	const dashboardStore = useDashboardStore();
	const tradeStore = useTradeStore();

	// топики, на которые приложение хочет быть подписано
	const activeTopics = new Set<Topic>();

	const socket = useState<Socket | null>("socket", () => null);
	const isLoadedTrades = useState<boolean>("isLoadedTrades", () => false); // получен первый пакет от "deals"

	const handleDisconnect = () => {
		connectionStore.errorMessage = "";
		isLoadedTrades.value = true;
		connectionStore.status = ConnectionStatuses.CLOSED;
		tradeStore.tradesMap.clear();
	};

	const resubscribeActiveTopics = () => {
		if (activeTopics.has("Deals")) socket.value?.emit("subscribeDeals");
		if (activeTopics.has("AccountInfo")) socket.value?.emit("subscribeAccountInfo");
	};

	const connectSocket = () => {
		if (socket.value || !import.meta.client || import.meta.test) return;

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
			resubscribeActiveTopics();
		});

		socket.value.on("disconnect", handleDisconnect);

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

		socket.value?.off();
		socket.value?.disconnect();
		socket.value = null;

		handleDisconnect();
	};

	const subscribe = (topic: Topic) => {
		activeTopics.add(topic);
		// если соединения нет, подписка отправится в обработчике "connect"
		if (socket.value?.connected) socket.value.emit(`subscribe${topic}`);
	};

	const unsubscribe = (topic: Topic) => {
		activeTopics.delete(topic);
		if (socket.value?.connected) socket.value.emit(`unsubscribe${topic}`);
	};

	const subscribeDeals = () => {
		isLoadedTrades.value = false;
		subscribe("Deals");
	};

	const unsubscribeDeals = () => unsubscribe("Deals");
	const subscribeAccountInfo = () => subscribe("AccountInfo");
	const unsubscribeAccountInfo = () => unsubscribe("AccountInfo");

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
