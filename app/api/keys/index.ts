export default {
	getDataProfile: ["profile-data"],
	getStrategy: ["strategy"],
	getExchanges: ["exchanges"],
	getExchangesMarkets: (exchangeName: string, search: string) => ["exchanges-markets", exchangeName, search],
	getConfigs: ["configs"],
	getConfig: (id: string) => ["configs", id],
	getCredentials: (exchangeName: string) => ["credentials", exchangeName],
	getOrders: (query = {}) => ["orders", ...Object.values(query)],
	getCoinGeckoId: (symbol: string) => ["gecko-coin-id", symbol],
	getMetricsSignals: (query = {}) => ["metrics-signals", ...Object.values(query)],
	getMetrics: ["metrics"],
};
