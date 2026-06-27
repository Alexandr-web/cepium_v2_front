import { defineStore } from "pinia";
import News from "@/models/News";
import type { TNews } from "@/types/api";

export const useNewsStore = defineStore("news-store", () => {
	const _news = ref<TNews[]>([
		{
			id: 1,
			title: "HIGH IMPACT",
			timestamp: "2026-06-27T12:34:56.789Z",
			content: "SEC approves new framework for digital asset spot liquidity. Neutral to Bullish sentiment detected.",
			risk: "high",
		},
		{
			id: 2,
			title: "MID IMPACT",
			timestamp: "2026-06-27T12:34:56.789Z",
			content: "Large whale movement detected on ETH: 45,000 ETH moved to cold storage.",
			risk: "moderate",
		},
		{
			id: 3,
			title: "LOW IMPACT",
			timestamp: "2026-06-27T12:34:56.789Z",
			content: "Unexpected CPI data release triggers volatility spike in USDT pairs.",
			risk: "low",
		},
	]);

	const _newsMap = computed(() => 
		_news.value.reduce<Map<TNews["id"], News>>((map, t) => {
			if (!map.has(t.id)) map.set(t.id, new News(t));
			return map;
		}, new Map())
	);

	const getAllNews = () => Array.from(_newsMap.value.values());
	const getNewsById = (id: TNews["id"]) => _newsMap.value.get(id);
	
	return { getAllNews, getNewsById };
});
