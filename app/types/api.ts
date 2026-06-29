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

export type TCoin = {
	symbol: string;
	fullSymbol: string;
	timestamp: number;
	price24h: number;
	volume24h: number;
	change24hprct: number;
	currentPrice: number;
	id: number;
};

export type TTrade = TCoin & {
	margin?: string;
	leverage?: string;
	amount: number;
	pnl: number;
	type: "future" | "spot";
	entryPrice: number;
	direction?: string;
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

export type TNews = {
	id: number;
	title: string;
	timestamp: string;
	content: string;
	risk: "high" | "moderate" | "low";
};

export type TUserEditData = {
	email?: string;
	password?: string;
};
