import { defineStore } from "pinia";
import type { TDashboard } from "@/types/api";

export const useDashboardStore = defineStore("dashboard-store", () => {
	const data = ref<TDashboard>({
		balance: 142032,
		balanceDailyChangePercent: 0.042,
		activePositionsCount: 2,
		dailyGoalPNL: 4300,
		pnl24h: 3120,
		usedMargin: 32000,
		availableMargin: 110000,
	});

	// TODO добавить после бека fetch метод для актуальных данных

	return { data };
});
