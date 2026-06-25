import { ofetch } from "ofetch";

export const apiFetch = ofetch.create({
	baseURL: process.env.API_URL,
	headers: {
		"X-Api-Key": String(process.env.API_KEY),
	},
});
