export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const { search, pathname } = getRequestURL(event);
	const targetPath = pathname.replace(/^\/api/, ''); 
	
	return proxyRequest(event, `${config.public.apiUrl}${targetPath}${search}`, {
		fetchOptions: { signal: AbortSignal.timeout(15000) }, // если внешний API зависнет, запрос будет висеть неограниченно, съедая соединение на Nitro-сервере
	});
});
