export default defineEventHandler(async (event) => {
	const path = getRouterParam(event, "path");
	const config = useRuntimeConfig();
	
	return proxyRequest(event, `${config.public.apiUrl}/${path}`);
});
