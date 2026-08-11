import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard-store",
	() => {
		const data = ref<TDashboard>({
			balance: 0,
			balanceDailyChangePercent: 0,
			activePositionsCount: 0,
			dailyGoalPNL: 0,
			pnl24h: 0,
			usedMargin: 0,
			availableMargin: 0,
		});

		return { data };
	},
	{
		persist: {
			// @ts-expect-error typescript не может определить тип path
			paths: ["data"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
