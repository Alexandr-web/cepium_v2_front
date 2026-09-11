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
		sort: true,
	},
	{
		key: "liquidationPrice",
		label: "Цена ликвидации",
		classes: "text-primary-500",
		sort: true,
		normalizer: (_, row) => row.prettyLiquidationPrice,
	},
	{
		key: "stopLossPrice",
		label: "Стоп",
		sort: true,
		classes: (row) => [row.prettyStopLossPrice !== "-" ? "text-secondary-500" : ""],
		normalizer: (_, row) => row.prettyStopLossPrice,
	},
	{
		key: "takeProfitPrice",
		label: "Тейк",
		sort: true,
		classes: (row) => [row.prettyTakeProfitPrice !== "-" ? "text-tertiary-500" : ""],
		normalizer: (_, row) => row.prettyTakeProfitPrice,
	},
	{
		key: "entryPrice",
		label: "Вход",
		sort: true,
		normalizer: (_, row) => row.prettyEntryPrice,
	},
	{
		key: "markPrice",
		label: "Текущая цена",
		sort: true,
		normalizer: (_, row) => row.prettyCurrentPrice,
	},
	{
		key: "pnl",
		label: "PNL",
		classes: (row) => ["font-bold", row.pnl >= 0 ? "text-tertiary-600" : "text-secondary-600"],
		sort: true,
		normalizer: (_, row) => row.prettyPnl,
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
		sort: true,
	},
	{
		key: "realizedPnl",
		label: "Профит",
		sort: true,
		normalizer: (v) => formatNum(Number(v), { currency: "USD", style: "currency", defaultValue: "-" }),
		classes: (row) => ["font-bold", (row.realizedPnl ?? 0) > 0 ? "text-tertiary-600" : "text-secondary-500"],
	},
	{
		key: "size",
		label: "Кол-во",
		sort: true,
		normalizer: (v) => formatNum(Number(v), { padZero: true }),
	},
	{
		key: "entryPrice",
		label: "Цена входа",
		sort: true,
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
