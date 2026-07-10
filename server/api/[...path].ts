import { ofetch } from "ofetch";

export default defineEventHandler(async (event) => {
	const path = getRouterParam(event, "path");
	const method = getMethod(event);
	const query = getQuery(event);
	const body = await readBody(event).catch(() => undefined);
	const headers = getHeaders(event);

	const config = useRuntimeConfig();

	const data = await ofetch(`/${path}`, {
		baseURL: process.env.API_URL,
		headers: {
			...headers,
			"x-api-key": String(config.public.apiUrl),
		},
		method,
		query,
		body,
	});

	return data;
});
