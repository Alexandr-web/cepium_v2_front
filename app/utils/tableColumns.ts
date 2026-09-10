import type Trade from "@/models/Trade";
import { useLocaleFormatTimeAgo } from "@/composables/useLocaleTime";

export const tradeColumns: TableColumn<Trade>[] = [
	{
		key: "index",
		label: "№",
		normalizer: (v) => formatNum(Number(v) + 1, { padZero: true }),
	},
	{
		key: "symbol",
		label: "Монета",
	},
	{
		key: "direction",
		label: "Направление",
	},
	{
		key: "prettyLiquidationPrice",
		label: "Цена ликвидации",
		classes: "text-primary-500",
	},
	{
		key: "prettyStopLossPrice",
		label: "Стоп",
		classes: (row) => [row.prettyStopLossPrice !== "-" ? "text-secondary-500" : ""],
	},
	{
		key: "prettyTakeProfitPrice",
		label: "Тейк",
		classes: (row) => [row.prettyTakeProfitPrice !== "-" ? "text-tertiary-500" : ""],
	},
	{
		key: "prettyEntryPrice",
		label: "Вход",
	},
	{
		key: "prettyCurrentPrice",
		label: "Текущая цена",
	},
	{
		key: "prettyPnl",
		label: "PNL",
		classes: (row) => ["font-bold", row.pnl >= 0 ? "text-tertiary-600" : "text-secondary-600"],
	},
	{
		key: "prettyCreatedAt",
		label: "Время открытия",
	},
	{
		key: "controls",
		label: "Действия",
	},
];

export const ordersColumns: TableColumn<Order>[] = [
	{
		key: "index",
		label: "№",
		normalizer: (v) => formatNum(Number(v) + 1, { padZero: true }),
	},
	{
		key: "symbol",
		label: "Монета",
		classes: "font-bold",
	},
	{
		key: "side",
		label: "Направление",
	},
	{
		key: "realizedPnl",
		label: "Профит",
		normalizer: (v) => formatNum(Number(v), { currency: "USD", style: "currency", defaultValue: "-" }),
		classes: (row) => ["font-bold", (row.realizedPnl ?? 0) > 0 ? "text-tertiary-600" : "text-secondary-500"],
	},
	{
		key: "size",
		label: "Кол-во",
		normalizer: (v) => formatNum(Number(v), { padZero: true }),
	},
	{
		key: "entryPrice",
		label: "Цена входа",
		normalizer: (v) => formatNum(Number(v), { currency: "USD", style: "currency" }),
		classes: "text-primary-600",
	},
	{
		key: "createdAt",
		label: "Время создания",
		normalizer: (v) => useLocaleFormatTimeAgo(new Date(String(v))),
		classes: "opacity-80",
	},
];
