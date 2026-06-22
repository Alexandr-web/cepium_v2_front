import type { TTrade } from "@/types/api";

export default class Trade {
	symbol: string;
	margin: string;
	leverage: string;
	amount: number;
	pnl: number;
	entryPrice: number;
	currentPrice: number;

	readonly trade: TTrade;

	constructor(trade: TTrade) {
		this.symbol = trade.symbol;
		this.margin = trade.margin;
		this.leverage = trade.leverage;
		this.amount = trade.amount;
		this.pnl = trade.pnl;
		this.entryPrice = trade.entryPrice;
		this.currentPrice = trade.currentPrice;
		this.trade = trade;
	}

	get prettyCurrentPrice() {
		return formatNum(this.currentPrice, { currency: "USD", style: "currency" });
	}

	get prettyEntryPrice() {
		return formatNum(this.entryPrice, { currency: "USD", style: "currency" });
	}

	get prettyPnl() {
		return formatNum(this.pnl, { currency: "USD", style: "currency" });
	}

	get prettyAmount() {
		return formatNum(this.amount, { padZero: true });
	}

	get prettyLeverage() {
		return formatNum(this.leverage, { padZero: true });
	}
};
