export default {
	getDataProfile: ["profile-data"],
	getStrategy: ["strategy"],
	getExchanges: ["exchanges"],
	getConfigs: ["configs"],
	getConfig: (id: string) => ["configs", id],
	getCredentials: (exchangeName: string) => ["credentials", exchangeName],
};
