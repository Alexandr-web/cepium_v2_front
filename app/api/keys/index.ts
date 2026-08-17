export default {
	getDataProfile: ["profile-data"],
	getStrategy: ["strategy"],
	getExchanges: ["exchanges"],
	getExchangesMarkets: (exchangeName: string, search: string) => ["exchanges-markets", exchangeName, search],
	getConfigs: ["configs"],
	getConfig: (id: string) => ["configs", id],
	getCredentials: (exchangeName: string) => ["credentials", exchangeName],
	getOrders: (exchangeName: string, query = {}) => ["orders", exchangeName, ...Object.values(query)],
};
