export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const { search, pathname } = getRequestURL(event);
	const targetPath = pathname.replace(/^\/api\/gecko/, "");

	return proxyRequest(event, `${config.geckoApiUrl}${targetPath}${search}`, {
		fetchOptions: {
			signal: AbortSignal.timeout(15000), // без этого зависший keyless-эндпоинт будет держать соединение вечно
		},
	});
});
