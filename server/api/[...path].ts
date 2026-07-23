export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const { search, pathname } = getRequestURL(event);
	const targetPath = pathname.replace(/^\/api/, ''); 
	
	return proxyRequest(event, `${config.public.apiUrl}${targetPath}${search}`);
});
