import tailwindcss from "@tailwindcss/vite";

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
		"@peterbud/nuxt-query",
		"@pinia/nuxt",
		"@vueuse/nuxt",
		"@nuxt/test-utils/module",
	],
	css: ["@/assets/css/global.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	icon: {
		mode: "css",
		cssLayer: "base",
	},
	nuxtQuery: {
		devtools: true,
	},
});
