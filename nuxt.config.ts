import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	app: {
		head: {
			title: "Cepium",
			viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
			htmlAttrs: {
				lang: "ru",
			},
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
			],
		},
	},
	modules: [
		"@nuxt/eslint",
		"@nuxt/image",
		"@nuxtjs/device",
		"@peterbud/nuxt-query",
		"@pinia/nuxt",
		"@vueuse/nuxt",
		"@nuxt/test-utils/module",
		"nuxt-svgo",
		"@pinia-plugin-persistedstate/nuxt",
	],
	runtimeConfig: {
		apiKey: process.env.API_KEY,
		public: {
			apiUrl: process.env.API_URL,
			wsUrl: process.env.PUBLIC_WS_URL,
		},
	},
	css: ["@/assets/css/global.css"],
	vite: {
		plugins: [tailwindcss()],
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
	imports: {
		dirs: [
			"@/types/**",
		],
	},
});
