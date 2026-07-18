export default {
	getDataProfile: ["profile-data"],
	getStrategy: ["strategy"],
	getCredentials: (exchangeName: string) => ["credentials", exchangeName],
};
