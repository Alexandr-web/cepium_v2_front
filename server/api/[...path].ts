export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const { search, pathname } = getRequestURL(event);
	const targetPath = pathname.replace(/^\/api/, "");
	const apiUrl = import.meta.dev ? config.public.apiUrl.dev : config.public.apiUrl.prod;

	return proxyRequest(event, `${apiUrl}${targetPath}${search}`, {
		fetchOptions: {
			signal: AbortSignal.timeout(15000), // если внешний API зависнет, запрос будет висеть неограниченно, съедая соединение на Nitro-сервере
		},
	});
});
