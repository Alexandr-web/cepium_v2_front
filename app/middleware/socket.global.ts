export default defineNuxtRouteMiddleware((to) => {
	if (!import.meta.client) return;

	const { connectSocket, disconnectSocket } = useExchangeSocket();

	if (!to.meta.noSocket) connectSocket();
	else disconnectSocket();
});
