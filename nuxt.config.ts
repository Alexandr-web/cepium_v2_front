// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	imports: {
		dirs: ["app/types"],
	},
	modules: [
		"@nuxt/eslint",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxtjs/device",
		"@nuxtjs/eslint-module",
		"@nuxtjs/tailwindcss",
		"@peterbud/nuxt-query",
		"@pinia/nuxt",
		"@vueuse/nuxt",
		"@nuxt/test-utils/module",
	],
	alias: {
		"@": "/<rootDir>/app",
		"~": "/<rootDir>/app",
	},
	tailwindcss: {
		cssPath: "@/assets/css/tailwind.css",
	},
	icon: {
		mode: "css",
		cssLayer: "base",
	},
	nuxtQuery: {
		devtools: true,
	},
});
