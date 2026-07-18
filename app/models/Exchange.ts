export default class Exchange {
	readonly name: string;
	readonly id: string;
	readonly connected: boolean;
	readonly credentials: string[];

	constructor(item: TExchange) {
		this.name = item.name;
		this.id = item.id;
		this.credentials = item.credentials;
		this.connected = false;
	}

	get logo() {
		switch (this.id) {
			case "bybit":
				return "/images/exchanges/bybit-logo.svg";
			case "binance":
				return "/images/exchanges/binance-logo.webp";
			case "okx":
				return "/images/exchanges/okx-logo.webp";
			default:
				return "";
		}
	}

	get prettyConnectedMessage() {
		if (this.connected) return "Подключено";
		return "Не подключено";
	}
};
