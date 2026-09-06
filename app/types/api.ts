export type Dashboard = {
	balance: number;
	balanceDailyChangePercent: number;
	activePositionsCount: number;
	dailyGoalPNL: number;
	pnl24h: number;
	usedMargin: number;
	availableMargin: number;
};

export type User = {
	email?: string | null;
	avatar?: string | null;
	name?: string | null;
	xApiKeyRegenerationAllowedAt?: string | null;
};

export type AuthLoginData = {
	email: string;
	password: string;
};

export type AuthLoginResponseData = {
	token?: string;
};

export type AuthLoginResponse = {
	message?: string | string[];
	path?: string;
	statusCode?: number;
	timestamp?: string;
	data?: AuthLoginResponseData;
};

export type UserEditGeneralData = {
	avatar?: File | null | string;
	email?: string;
	name?: string;
	xApiKeyRegenerationAllowedAt?: string | null;
};

export type UserEditGeneralDataResponse = {
	data?: User;
	message?: string | string[];
	statusCode?: number;
};

export type UserEditSecurityData = {
	oldPassword?: string;
	newPassword?: string;
};

export type UserConfirmChangeSecurityData = {
	code: string;
};

export type UserChangePasswordResponse = {
	data?: boolean;
	message?: string;
	statusCode?: number;
};

export type UserConfirmChangePasswordResponse = {
	data?: boolean;
	message?: string;
	statusCode?: number;
};

export type UserDataResponse = {
	data?: User;
	message?: string;
	statusCode?: number;
};

export type ConfigData = {
	margin: string;
	allowedSymbols: string[];
	maxLeverage: number;
	maxLossPercent: number;
	strategyId: string;
	dailyGoalPercent: number;
	maxPositionSize: number;
	activate: boolean;
};

export type StrategyEntity = {
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

export type StrategyDataResponse = {
	statusCode: number;
	data: StrategyEntity[];
	message?: string;
};

export type Exchange = {
	id: string;
	name: string;
	filled: boolean;
};

export type ExchangeWithCredentials = Exchange & {
	credentials: string[];
};

export type ExchangeCredentials = {
	apiKey: string;
	secretKey: string;
	password: string;
	uid: string;
	privateKey: string;
	walletAddress: string;
	demoTrading: boolean;
};

export type ExchangeCredentialsResponse = {
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
		exchange?: Exchange;
		demoTrading?: boolean;
	};
	statusCode: number;
	message: string;
};

export type UserConfigEntity = {
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
	strategy: StrategyEntity;
};

export type UserOrderEntity = {
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
};

export type CreateExchangeCredentialsUser = {
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
	userConfigs: [UserConfigEntity];
	orders: [UserOrderEntity];
};

export type CreateExchangeCredentialsResponse = {
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
	user: CreateExchangeCredentialsUser;
	exchange: ExchangeWithCredentials;
};

export type ChangeExchangeCredentialsResponse = CreateExchangeCredentialsResponse;

export type ExchangesResponse = {
	statusCode: number;
	data: Exchange[];
	message: string;
};

export type ConfigResponse = Omit<ConfigData, "strategyId"> & {
	strategy: StrategyEntity;
	id: string;
	exchangeName: string;
};

export type ConfigsResponse = {
	statusCode: number;
	data: ConfigResponse[];
	message: string;
};

export type ConfigByIdResponse = {
	statusCode: number;
	data: ConfigResponse;
	message: string;
};

export type ConfigCreateResponse = {
	statusCode: number;
	data: ConfigResponse[];
	message: string;
};

export type ConfigChangeResponse = ConfigCreateResponse;

export type Order = {
	id?: string;
	symbol?: string;
	side?: string;
	size?: number;
	entryPrice?: number;
	markPrice?: number;
	leverage?: number;
	liquidationPrice?: number;
	unrealizedPnl?: number;
	pnlPercent?: number;
	exitPrice?: number;
	takeProfitPrice?: number;
	stopLossPrice?: number;
	createdAt: string;
	realizedPnl?: number;
	closedAt?: string;
};

export type OrderResponse = {
	statusCode: number;
	data: {
		orders: Order[];
		newOffset: number;
		total: number;
	};
	message: string;
};

export type RemoveOrderResponse = {
	statusCode: number;
	data: Order;
	message: string;
};

export type ExchangeMarket = {
	symbol: string;
	base: string;
	quote: string;
	active: boolean;
};

export type ExchangesMarketsResponse = {
	statusCode: number;
	data: ExchangeMarket[];
	message: string;
};

export type Position = {
	closedAt: null | number;
	createdAt?: string;
	entryPrice: number;
	leverage: number;
	liquidationPrice: number;
	markPrice: number;
	pnlPercent: number;
	realizedPnl: null | number;
	side: string;
	size: number;
	stopLossPrice: null | number;
	symbol: string;
	takeProfitPrice: null | number;
	unrealizedPnl: number;
	id: string;
};

export type CoinGecko = {
	id: string;
	name: string;
	api_symbol: string;
	symbol: string;
	market_cap_rank: number | null;
	thumb: string;
	large: string;
};

export type GeckoSearchResponse = {
	coins: CoinGecko[];
};
