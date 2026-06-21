import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	modules: [
		"@nuxt/eslint",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxtjs/device",
		"@peterbud/nuxt-query",
		"@pinia/nuxt",
		"@vueuse/nuxt",
		"@nuxt/test-utils/module",
		"nuxt-svgo",
	],
	runtimeConfig: {
		apiUrl: process.env.API_URL,
		wsUrl: process.env.WS_URL,
	},
	css: ["@/assets/css/global.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	icon: {
		mode: "svg",
		serverBundle: {
			collections: ["material-symbols"],
		},
	},
	svgo: {
		defaultImport: "component",
	},
	nuxtQuery: {
		devtools: true,
	},
	image: {
		format: ["webp"],
	},
});
