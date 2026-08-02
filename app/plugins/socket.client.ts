import { io } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";
import { useConnectionStore } from "@/store/useConnectionStore";

export default defineNuxtPlugin(() => {
	const connectionStore = useConnectionStore();
	const authStore = useAuthStore();

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

	return { provide: { socket } };
});
