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
	name: string|null;
	xApiKeyRegenerationAllowedAt: string|null;
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

export type TUserEditGeneralData = {
	avatar?: File;
	email?: string;
	name?: string;
};

export type TUserEditGeneralDataResponse = {
	data?: TUser,
	message?: string|string[];
	statusCode?: number;
};

export type TUserEditSecurityData = {
	oldPassword?: string;
	newPassword?: string;
};

export type TUserConfirmChangeSecurityData = {
	code: string;
};

export type TUserChangePasswordResponse = {
	data?: boolean;
	message?: string;
	statusCode?: number;
};

export type TUserConfirmChangePasswordResponse = {
	data?: boolean;
	message?: string;
	statusCode?: number;
};

export type TUserDataResponse = {
	data?: TUser;
	message?: string;
	statusCode?: number;
};

export type TExchangeData = {
  margin: string;
  allowedSymbols: string[];
  maxLeverage: number;
  maxLossPercent: number;
  strategyId: string;
  dailyGoalPercent: number;
  maxPositionSize: number;
  demoTrading: boolean;
  activate: boolean;
};

export type TStrategyEntity = {
	id: string;
	name: string;
	description: string;
	algoSection: {
		indicators: string[];
		shortlistConditions: object;
	};
	timeframe: string;
	params: object;
};

export type TStrategyDataResponse = {
	statusCode: number;
	data: TStrategyEntity[];
  	message?: string;
};
