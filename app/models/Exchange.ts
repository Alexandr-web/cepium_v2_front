export default class Exchange {
	readonly name: string;
	readonly id: string;
	readonly filled: boolean;

	constructor(item: TExchange) {
		this.name = item.name;
		this.id = item.id;
		this.filled = item.filled;
	}

	get logo() {
		switch (this.name) {
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
		if (this.filled) return "Подключено";
		return "Не подключено";
	}
};
