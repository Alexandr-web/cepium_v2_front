import { io, type Socket } from "socket.io-client";

export const useBybitSocket = (initialInterval = "15") => {
	const data = shallowRef<TickerData | null>(null);
	const kline = shallowRef<BybitKline | null>(null);
	const currentSymbol = ref<string | null>(null);
	const interval = ref(initialInterval);
	const isConnected = ref(false);

	let socket: Socket | null = null;

	// восстановление подписки после реконнекта
	const onSocketConnect = () => {
		isConnected.value = true;
		if (currentSymbol.value) {
			socket?.emit("subscribe", { symbol: currentSymbol.value });
			socket?.emit("subscribe", { symbol: currentSymbol.value, interval: interval.value });
		}
	};

	const onSocketDisconnect = () => isConnected.value = false;

	const onSocketError = (err: unknown) => {
		console.error(err);
		isConnected.value = false;
	};

	const onTicker = (payload: TickerData) => {
		const symbol = formatBybitSymbol(payload?.symbol);

		if (!symbol || symbol !== currentSymbol.value) return;
		data.value = payload;
	};

	// отбрасываем запоздавшие свечи прежнего символа или таймфрейма
	const onKline = (payload: BybitKline) => {
		const symbol = formatBybitSymbol(payload?.symbol);

		if (!symbol || symbol !== currentSymbol.value) return;
		if (payload.interval !== interval.value) return;
		kline.value = payload;
	};

	// создание сокета
	const ensureSocket = (): Socket | null => {
		if (!import.meta.client) return null;
		if (socket) return socket;

		socket = io(undefined, {
			path: "/bybit/socket.io",
			autoConnect: true,
			withCredentials: true,
			transports: ["websocket"],
		});

		socket.on("connect", onSocketConnect);
		socket.on("disconnect", onSocketDisconnect);
		socket.on("connect_error", onSocketError);
		socket.on("error", onSocketError);
		socket.on("ticker", onTicker);
		socket.on("kline", onKline);

		return socket;
	};

	const unsubscribe = (rawSymbol?: string) => {
		const target = formatBybitSymbol(rawSymbol ?? currentSymbol.value);
		if (!target || target !== currentSymbol.value) return;

		socket?.emit("unsubscribe", { symbol: target });
		socket?.emit("unsubscribe", { symbol: target, interval: interval.value });
		currentSymbol.value = null;
		data.value = null;
		kline.value = null;
	};

	const subscribe = (rawSymbol: string) => {
		const symbol = formatBybitSymbol(rawSymbol);
		if (!symbol || symbol === currentSymbol.value) return;

		// одна активная подписка на инстанс: сначала отписываемся от прошлой
		if (currentSymbol.value) unsubscribe();

		const s = ensureSocket();
		if (!s) return;

		currentSymbol.value = symbol;
		data.value = null;
		kline.value = null;

		// если сокет уже подключён - подписка уйдёт сразу
		if (s.connected) {
			s.emit("subscribe", { symbol });
			s.emit("subscribe", { symbol, interval: interval.value });
		}
	};

	const setTimeframe = (next: string) => {
		if (next === interval.value) return;

		const prev = interval.value;
		interval.value = next;
		kline.value = null;

		if (!currentSymbol.value || !socket?.connected) return;
		socket.emit("unsubscribe", { symbol: currentSymbol.value, interval: prev });
		socket.emit("subscribe", { symbol: currentSymbol.value, interval: next });
	};

	const disconnect = () => {
		unsubscribe();
		socket?.off();
		socket?.disconnect();
		socket = null;
		isConnected.value = false;
	};

	return {
		data,
		kline,
		interval,
		currentSymbol,
		isConnected,
		subscribe,
		unsubscribe,
		setTimeframe,
		disconnect,
	};
};
