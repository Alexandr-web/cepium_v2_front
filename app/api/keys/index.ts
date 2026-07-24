export default {
	getDataProfile: ["profile-data"],
	getStrategy: ["strategy"],
	getExchanges: ["exchanges"],
	getCredentials: (exchangeName: string) => ["credentials", exchangeName],
};
