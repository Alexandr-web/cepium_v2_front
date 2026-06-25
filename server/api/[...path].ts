// server/api/[...path].ts
import { apiFetch } from "../utils/apiFetch";

export default defineEventHandler(async (event) => {
	const path = getRouterParam(event, "path");
	const method = getMethod(event);
	const query = getQuery(event);
	const body = await readBody(event).catch(() => undefined);

	const data = await apiFetch(`/${path}`, {
		method,
		query,
		body,
	});

  	return data;
});
