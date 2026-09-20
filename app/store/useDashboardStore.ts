export const useDashboardStore = defineStore("dashboard-store",
	() => {
		const data = ref<Dashboard>({
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
			pick: ["data"],
			storage: persistedState.cookiesWithOptions({ sameSite: "strict" }),
		},
	}
);
