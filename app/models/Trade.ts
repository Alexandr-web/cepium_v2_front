import type { TTrade } from "@/types/api";
import Coin from "@/models/Coin";

export default class Trade extends Coin {
	margin: string;
	leverage: string;
	amount: number;
	pnl: number;
	pnlPercent: number;

	readonly entryPrice: number;
	readonly direction: string;
	readonly trade: TTrade;

	constructor(trade: TTrade) {
		super(trade);

		this.margin = trade.margin;
		this.leverage = trade.leverage;
		this.amount = trade.amount;
		this.pnl = trade.pnl;
		this.entryPrice = trade.entryPrice;
		this.direction = trade.direction;
		this.pnlPercent = trade.pnlPercent;
		this.trade = trade;
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
