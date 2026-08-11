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
	email?: string|null;
	avatar?: string|null;
	name?: string|null;
	xApiKeyRegenerationAllowedAt?: string|null;
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
	avatar?: File|null|string;
	email?: string;
	name?: string;
	xApiKeyRegenerationAllowedAt?: string|null;
};

export type TUserEditGeneralDataResponse = {
	data?: TUser;
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

export type TConfigData = {
	margin: string;
	allowedSymbols: string[];
	maxLeverage: number;
	maxLossPercent: number;
	strategyId: string;
	dailyGoalPercent: number;
	maxPositionSize: number;
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

export type TExchange = {
	id: string;
	name: string;
	filled: boolean;
};

export type TExchangeCredentials = {
	apiKey: string;
	secretKey: string;
	password: string;
	uid: string;
	privateKey: string;
	walletAddress: string;
	demoTrading: boolean;
};

export type TExchangeCredentialsResponse = {
	data: {
		id?: string;
		apiKey?: string;
		secretKey?: string;
		password?: string;
		uid?: string;
		privateKey?: string;
		walletAddress?: string;
		createdAt?: string;
		updatedAt?: string;
		userId?: string;
		exchangeName?: string;
		user?: string;
		exchange?: TExchange;
		demoTrading?: boolean;
	};
	statusCode: number;
	message: string;
};

export type TChangeExchangeCredentialsResponse = TCreateExchangeCredentialsResponse;

export type TCreateExchangeCredentialsResponse = {
	id: string;
	apiKey: string;
	secretKey: string;
	password: string;
	uid: string;
	privateKey: string;
	walletAddress: string;
	createdAt: string;
	updatedAt: string;
	userId: string;
	exchangeName: string;
	demoTrading: boolean;
	user: {
		id: string;
		name: string;
		avatar: string;
		email: string;
		password: string;
		xApiKeyEmailSent: boolean;
		xApiKeyId: string;
		xApiKeySecret: string;
		xApiKeyRegenerationAllowedAt: string;
		credentials: string[];
		userConfigs: [
			{
				id: string;
				demoTrading: boolean;
				maxPositionSize: number;
				margin: string;
				dailyGoalPercent: number;
				activate: boolean;
				allowedSymbols: string[];
				maxLeverage: number;
				maxLossPercent: number;
				exchangeName: string;
				strategyId: string;
				userId: string;
				user: string;
				strategy: TStrategyEntity;
			}
		];
		orders: [
			{
				id: string;
				symbol: string;
				side: string;
				size: number;
				entryPrice: number;
				exitPrice: number;
				markPrice: number;
				liquidationPrice: number;
				unrealizedPnl: number;
				leverage: number;
				realizedPnl: number;
				pnlPercent: number;
				createdAt: string;
				closedAt: string;
				exchangeName: string;
				userId: string;
				user: string;
			}
		]
	};
	exchange: TExchange & { credentials: string[]; };
};

export type TExchangesResponse = {
  statusCode: number;
  data: TExchange[];
  message: string;
};

export type TConfigResponse = Omit<TConfigData, "strategyId"> & { strategy: TStrategyEntity; id: string; exchangeName: string; };

export type TConfigsResponse = {
	statusCode: number;
	data: TConfigResponse[];
	message: string;
};

export type TConfigByIdResponse = {
	statusCode: number;
	data: TConfigResponse;
	message: string;
};

export type TConfigCreateResponse = {
	statusCode: number;
	data: TConfigResponse[];
	message: string;
};

export type TConfigChangeResponse = TConfigCreateResponse;

export type TOrder = {
	symbol: string;
	direction: string;
	amount: number;
	time: string;
	enterPrice: number;
	type: string;
	position: string;
	status: string;
	pnl?: number;
};

export type TOrderResponse = {
	statusCode: number;
	data: TOrder[];
	message: string;
};

export type TExchangeMarket = {
  symbol: string;
  base: string;
  quote: string;
  active: boolean;
};

export type TExchangesMarketsResponse = {
	statusCode: number;
	data: TExchangeMarket[];
	message: string;
};

export type TPosition = {
	closedAt: null|number;
	entryPrice: number;
	leverage: number;
	liquidationPrice: number;
	markPrice: number;
	pnlPercent: number;
	realizedPnl: null|number;
	side: string;
	size: number;
	stopLossPrice: null|number;
	symbol: string;
	takeProfitPrice: null|number;
	unrealizedPnl: number;
};
