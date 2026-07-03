import { ofetch } from "ofetch";

export default defineEventHandler(async (event) => {
	const path = getRouterParam(event, "path");
	const method = getMethod(event);
	const query = getQuery(event);
	const body = await readBody(event).catch(() => undefined);

	const data = await ofetch(`/${path}`, {
		baseURL: process.env.API_URL,
		headers: {
			"x-api-key": String(process.env.API_KEY),
		},
		method,
		query,
		body,
	});

  	return data;
});
