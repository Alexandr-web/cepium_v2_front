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
		"notivue/nuxt",
		"nuxt-echarts",
	],
	runtimeConfig: {
		apiKey: process.env.API_KEY,
		public: {
			apiUrl: process.env.API_URL,
			wsUrl: process.env.PUBLIC_WS_URL,
		},
	},
	css: ["@/assets/css/global.css", "notivue/notification.css", "notivue/animations.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	svgo: {
		defaultImport: "component",
	},
	notivue: {
		pauseOnHover: true,
		pauseOnTouch: true,
		teleportTo: "body",
		position: "top-center",
		limit: 4,
		enqueue: true,
		avoidDuplicates: true,
		notifications: {
			global: {
				duration: 5000,
			},
		},
	},
	nuxtQuery: {
		devtools: true,
		queryClientOptions: {
			defaultOptions: {
				queries: {
					staleTime: 60 * 5000,
					refetchOnWindowFocus: false,
					retry: false,
				},
			},
		},
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
