export default defineNuxtRouteMiddleware((to) => {
	const { connectSocket, disconnectSocket } = useExchangeSocket();

	if (!to.meta.noSocket) connectSocket();
	else disconnectSocket();
});
