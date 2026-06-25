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
		apiKey: process.env.API_KEY,
		public: {
			apiUrl: process.env.API_URL,
			wsUrl: process.env.WS_URL,
			baseApiUrl: process.env.BASE_API_URL,
		},
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
