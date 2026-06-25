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
    email: string|null;
    avatar: string|null;
};

export type TTrade = {
	symbol: string;
	fullSymbol: string;
	margin: string;
	leverage: string;
	amount: number;
	pnl: number;
	entryPrice: number;
	currentPrice: number;
	timestamp: number;
	id: number;
	direction: string;
	pnlPercent: number;
};

export type TAuthLoginData = {
	email: string;
	password: string;
};

export type TAuthLoginResponseData = {
	token?: string;
};
export type TAuthLoginResponse = {
	message?: string|string[];
	path?: string;
	statusCode?: number;
	timestamp?: string;
	data?: TAuthLoginResponseData;
};
