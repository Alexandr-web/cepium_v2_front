export default defineNuxtRouteMiddleware((to) => {
	if (!import.meta.client || import.meta.test) return;

	const { connectSocket, disconnectSocket } = useExchangeSocket();

	if (!to.meta.noSocket) connectSocket();
	else disconnectSocket();
});
