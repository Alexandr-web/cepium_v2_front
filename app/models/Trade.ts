import type { TTrade } from "@/types/api";

export default class Trade {
	symbol: string;
	fullSymbol: string;
	margin: string;
	leverage: string;
	amount: number;
	pnl: number;
	entryPrice: number;
	currentPrice: number;
	timestamp: number;
	id: number;
	direction: string;
	pnlPercent: number;

	readonly trade: TTrade;

	constructor(trade: TTrade) {
		this.symbol = trade.symbol;
		this.margin = trade.margin;
		this.leverage = trade.leverage;
		this.amount = trade.amount;
		this.pnl = trade.pnl;
		this.entryPrice = trade.entryPrice;
		this.currentPrice = trade.currentPrice;
		this.timestamp = trade.timestamp;
		this.id = trade.id;
		this.direction = trade.direction;
		this.fullSymbol = trade.fullSymbol;
		this.pnlPercent = trade.pnlPercent;
		this.trade = trade;
	}

	get prettyCurrentPrice() {
		return formatNum(this.currentPrice, { currency: "USD", style: "currency" });
	}

	get prettyEntryPrice() {
		return formatNum(this.entryPrice, { currency: "USD", style: "currency" });
	}

	get prettyPnl() {
		const n = formatNum(this.pnl, { currency: "USD", style: "currency" });
		return this.pnl > 0 ? "+" + n : n;
	}

	get prettyAmount() {
		return formatNum(this.amount, { padZero: true });
	}

	get prettyPnlPercent() {
		const n = formatNum(this.pnlPercent, { style: "percent" });
		return this.pnlPercent > 0 ? "+" + n : n;
	}

	get prettyLeverage() {
		return formatNum(this.leverage, { padZero: true }) + "x";
	}
};
