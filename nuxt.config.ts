import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	app: {
		head: {
			title: "Bitrit",
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
		"@nuxt/fonts",
	],
	runtimeConfig: {
		public: {
			apiUrl: process.env.NUXT_PUBLIC_API_URL,
			wsUrl: process.env.NUXT_PUBLIC_WS_URL,
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
		devtools: false,
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
	echarts: {
		renderer: "svg",
		charts: ["BarChart", "LineChart", "PieChart", "ScatterChart"],
		components: ["DatasetComponent", "GridComponent", "TooltipComponent", "LegendComponent", "GraphicComponent"],
		features: ["LabelLayout", "UniversalTransition", "LegacyGridContainLabel"],
	},
	imports: {
		dirs: [
			"@/types/**",
		],
	},
	fonts: {
		defaults: {
			fallbacks: {
				"sans-serif": ["Roboto"],
			},
		},
		providers: {
			google: false,
			bunny: false,
		},
		families: [
			{
				name: "Inter",
				provider: "local",
				weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
				styles: ["normal", "italic"],
				subsets: ["latin"],
				global: true,
			},
		],
	},
});
