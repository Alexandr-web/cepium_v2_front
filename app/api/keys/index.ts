export default {
	getDataProfile: ["profile-data"],
	getStrategy: ["strategy"],
	getExchanges: ["exchanges"],
	getConfigs: ["configs"],
	getCredentials: (exchangeName: string) => ["credentials", exchangeName],
};
