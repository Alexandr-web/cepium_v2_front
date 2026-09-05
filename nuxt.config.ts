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
		"@nuxt/fonts",
	],
	runtimeConfig: {
		geckoApiUrl: process.env.NUXT_GECKO_API_URL,
		public: {
			apiUrl: process.env.NUXT_PUBLIC_API_URL,
			wsUrl: process.env.NUXT_PUBLIC_WS_URL,
		},
	},
	css: ["@/assets/css/global.css", "notivue/notification.css", "notivue/animations.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	vue: {
		compilerOptions: {
			isCustomElement: (tag) => ["gecko-coin-price-marquee-widget", "gecko-coin-ticker-widget"].includes(tag),
		},
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
					staleTime: 60 * 1000,
					gcTime: 5 * 60 * 1000,
					refetchOnWindowFocus: false,
					refetchOnReconnect: true,
					retry: 1,
					retryDelay: 1000,
				},
				mutations: {
					retry: 0,
				},
			},
		},
	},
	image: {
		format: ["webp"],
		provider: "ipx",
		ipx: {
			maxAge: 2592000,
		},
	},
	echarts: {
		renderer: "svg",
		charts: ["BarChart", "LineChart", "PieChart"],
		components: ["GridComponent", "TooltipComponent", "LegendComponent"],
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
