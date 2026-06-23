export type TDashboard = {
	balance: number;
	balanceDailyChangePercent: number;
	activePositionsCount: number;
	dailyGoalPNL: number;
	pnl24h: number;
	usedMargin: number;
	availableMargin: number;
};

export type TUser = {
    name: string|null;
    avatar: string|null;
};

export type TTrade = {
	symbol: string;
	margin: string;
	leverage: string;
	amount: number;
	pnl: number;
	entryPrice: number;
	currentPrice: number;
	timestamp: number;
	id: number;
};
