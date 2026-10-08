import type { Socket } from "socket.io-client";
import { useExchangeStore } from "@/store/useExchangeStore";

export const useSocket = () => {
	const socket = useState<Socket | null>("socket", () => null);
	const isLoadedTrades = useState("isLoadedTrades", () => false); // получен первый пакет от "deals"

	const exchangeStore = useExchangeStore();

	// общий payload для работы со всеми событиями
	const payload = computed(() => ({ exchangeName: exchangeStore.activeExchange }));

	const subscribeDeals = () => {
		isLoadedTrades.value = false;
		socket.value?.emit("subscribeDeals", payload.value);
	};

	const unsubscribeDeals = () => socket.value?.emit("unsubscribeDeals", payload.value);
	const subscribeAccountInfo = () => socket.value?.emit("subscribeAccountInfo", payload.value);
	const unsubscribeAccountInfo = () => socket.value?.emit("unsubscribeAccountInfo", payload.value);

	return { isLoadedTrades, subscribeDeals, unsubscribeDeals, subscribeAccountInfo, unsubscribeAccountInfo };
};
