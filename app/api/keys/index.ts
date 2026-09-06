export default {
	getDataProfile: ["profile-data"],
	getStrategy: ["strategy"],
	geExchanges: ["exchanges"],
	geExchangesMarkets: (exchangeName: string, search: string) => ["exchanges-markets", exchangeName, search],
	getConfigs: ["configs"],
	getConfig: (id: string) => ["configs", id],
	getCredentials: (exchangeName: string) => ["credentials", exchangeName],
	geOrders: (exchangeName: string, query = {}) => ["orders", exchangeName, ...Object.values(query)],
	geCoinGeckoId: (symbol: string) => ["gecko-coin-id", symbol],
};
