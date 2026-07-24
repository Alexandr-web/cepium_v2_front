export default class Coin {
	timestamp: number;
	price24h: number;
	volume24h: number;
	change24hprct: number;
	currentPrice: number;

	readonly symbol: string;
	readonly fullSymbol: string;
	readonly id: number;
	readonly coin: TCoin;
	
	constructor(coin: TCoin) {
		this.symbol = coin.symbol;
		this.fullSymbol = coin.fullSymbol;
		this.price24h = coin.price24h;
		this.timestamp = coin.timestamp;
		this.volume24h = coin.volume24h;
		this.change24hprct = coin.change24hprct;
		this.id = coin.id;
		this.currentPrice = coin.currentPrice;

		this.coin = coin;
	}

	get prettyCurrentPrice() {
		return formatNum(this.currentPrice, { currency: "USD", style: "currency" });
	}

	get prettyPrice24h() {
		return formatNum(this.price24h, { currency: "USD", style: "currency" });
	}

	get prettyVolume24h() {
		return formatNum(this.volume24h, { currency: "USD", style: "currency" });
	}

	get prettyChange24hprct() {
		const n = formatNum(this.change24hprct, { style: "percent" });
		return this.change24hprct > 0 ? "+" + n : n;
	}
};
