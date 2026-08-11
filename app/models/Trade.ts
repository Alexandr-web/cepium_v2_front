export default class Trade {
	leverage?: number;
	amount: number;
	pnl: number;
	pnlPercent: number;
	markPrice: number;
	liquidationPrice: number;
	stopLossPrice: null|number;
	takeProfitPrice: null|number;

	readonly id: string;
	readonly entryPrice: number;
	readonly direction?: string;
	readonly trade: TPosition;
	readonly symbol: string;

	constructor(trade: TPosition) {
		this.leverage = trade.leverage;
		this.amount = trade.size;
		this.pnl = trade.unrealizedPnl;
		this.entryPrice = trade.entryPrice;
		this.direction = trade.side;
		this.pnlPercent = trade.pnlPercent;
		this.markPrice = trade.markPrice;
		this.symbol = trade.symbol;
		this.liquidationPrice = trade.liquidationPrice;
		this.takeProfitPrice = trade.takeProfitPrice;
		this.stopLossPrice = trade.stopLossPrice;
		this.id = crypto.randomUUID();
		this.trade = trade;
	}

	// обновление данных сделки при получении с ws
	updateData(data: TPosition) {
		this.leverage = data.leverage;
		this.amount = data.size;
		this.pnl = data.unrealizedPnl;
		this.pnlPercent = data.pnlPercent / 100;
		this.markPrice = data.markPrice;
		this.liquidationPrice = data.liquidationPrice;
		this.takeProfitPrice = data.takeProfitPrice;
		this.stopLossPrice = data.stopLossPrice;
	}

	get shortSymbol() {
		return this.symbol.replace(/\/.+:.+$/, "");
	}

	get prettyLiquidationPrice() {
		return formatNum(this.liquidationPrice, { currency: "USD", style: "currency", defaultValue: "-" });
	}

	get prettyTakeProfitPrice() {
		return formatNum(Number(this.takeProfitPrice), { currency: "USD", style: "currency", defaultValue: "-" });
	}

	get prettyStopLossPrice() {
		return formatNum(Number(this.stopLossPrice), { currency: "USD", style: "currency", defaultValue: "-" });
	}

	get prettyCurrentPrice() {
		return formatNum(this.markPrice, { currency: "USD", style: "currency" });
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
		return !this.leverage ? "-" : this.leverage + "x";
	}
};
