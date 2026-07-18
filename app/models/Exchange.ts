export default class Exchange {
	readonly name: string;
	readonly id: string;

	constructor(item: TExchange) {
		this.name = item.name;
		this.id = item.id;
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
};
