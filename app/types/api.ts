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
	avatar?: File|null|string;
	email?: string;
	name?: string;
	xApiKeyRegenerationAllowedAt?: string|null;
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

export type TExchange = {
	id: string;
	name: string;
	credentials: string[];
};

export type TExchangeCredentials = {
  apiKey: string;
  secretKey: string;
  password: string;
  uid: string;
  privateKey: string;
  walletAddress: string;
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
	exchange?: {
		id?: string;
		name?: string;
		credentials?: string[];
	};	
  },
  statusCode: number;
  message: string;
};

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
        id: string,
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
        strategy: {
          id: string;
          name: string;
          description: string;
          algoSection: {
            indicators: string[];
            shortlistConditions: object;
          },
          timeframe: string;
          params: object;
          userConfigs: string[];
        }
      }
    ],
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
  },
  exchange: TExchange;
};
