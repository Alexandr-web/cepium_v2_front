import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2026-10-10",
	devtools: {
		enabled: process.env.NODE_ENV !== "production",
	},
	devServer: {
		port: 3000,
	},
	runtimeConfig: {
		apiUrl: process.env.NUXT_API_URL,
		public: {
			geckoApiUrl: process.env.NUXT_PUBLIC_GECKO_API_URL,
			apiUrl: process.env.NUXT_PUBLIC_API_URL,
			wsUrl: process.env.NUXT_PUBLIC_WS_URL,
		},
	},
	vite: {
		plugins: [tailwindcss()],
		server: {
			proxy: {
				"/api": {
					target: process.env.NUXT_API_URL,
					changeOrigin: true,
					secure: false,
				},
			},
		},
	},
	app: {
		head: {
			title: "Cepium",
			viewport: "width=device-width, initial-scale=1.0, viewport-fit=cover",
			htmlAttrs: {
				lang: "ru",
			},
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" },
			],
		},
		pageTransition: { name: "page", mode: "out-in" },
	},
	modules: [
		"@nuxt/eslint",
		"@nuxt/image",
		"@peterbud/nuxt-query",
		"@pinia/nuxt",
		"@vueuse/nuxt",
		"nuxt-svgo",
		"notivue/nuxt",
		"nuxt-echarts",
		"@nuxt/fonts",
	],
	css: ["@/assets/css/global.css", "notivue/notification.css", "notivue/animations.css"],
	vue: {
		compilerOptions: {
			isCustomElement: (tag) =>
				[
					"gecko-coin-price-marquee-widget",
					"gecko-coin-ticker-widget",
					"gecko-coin-price-chart-widget",
				].includes(tag),
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
		components: ["GridComponent", "TooltipComponent", "LegendComponent", "TitleComponent"],
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
			googleicons: false,
			bunny: false,
			fontshare: false,
			fontsource: false,
			adobe: false,
		},
		families: [
			{
				name: "Inter",
				provider: "local",
				weights: [300, 400, 500, 600],
				styles: ["normal"],
				subsets: ["latin"],
				global: true,
			},
		],
	},
});
