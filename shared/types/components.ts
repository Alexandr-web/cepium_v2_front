import type { Component } from "vue";

export type TableColumn<T> = {
	key: keyof T | "controls" | "index";
	label: string;
	align?: "left" | "center" | "right";
	classes?: string | string[] | ((row: T) => string | string[]);
	sort?: boolean;
	normalizer?: (val: number | string | T[keyof T], row: T) => string;
};

export type SelectItem = {
	label: string;
	value: string;
};

export type FilterItem = {
	name: string;
	component: Component;
	label: string;
	value: string | string[] | boolean;
	items?: SelectItem[];
	classes?: string;
};

export type StatisticsCard = {
	id: string;
	title: string;
	icon?: string;
	classesValue?: string | string[];
	iconClasses?: string | string[];
	normalizer?: (value: string | number) => string;
	value: string | number;
};

export enum ImagePreset {
	COIN = "coin",
	AVATAR = "avatar",
};

export enum ButtonMode {
	DEFAULT = "default",
	REMOVE_FILL = "remove-fill",
	REMOVE_BORDER = "remove-border",
	NEUTRAL_FILL = "neutral-fill",
	BLACK_FILL = "black-fill",
	PRIMARY_FILL = "primary-fill",
	PRIMARY_BORDER = "primary-border",
	TERTIARY_BORDER = "tertiary-border"
};

export enum MenuPreset {
	MOBILE = "mob",
	DESKTOP = "desk",
};

export enum FilterControlsPreset {
	MOBILE = "mob",
	DESKTOP = "desk",
};

export enum CheckboxTheme {
	PRIMARY = "primary",
	NEUTRAL = "neutral",
};

export enum CheckboxSize {
	SMALL = "small",
	BIG = "big",
};

export enum ControlsListPreset {
	TRADE = "trade",
	TRADES = "trades",
};

export type ActivityItem = {
	date: string;
	value: number;
};

export type ActivityItemCell = {
	date: string;
	value: number;
	level: number;
	month: number;
	formatDate: string;
};

export type WizardItem = {
	label?: string;
	completed: boolean;
	name: string;
	active: boolean;
};

export type ProfitDynamicsItem = {
	date: string;
	day_of_week: string;
	profit_usd: number;
};

export type TradeByAssetItem = {
	asset: string;
	count: number;
};

export type WinLossRatio = {
	profitable_count: number;
	loss_count: number;
};

export type StatisticsChartsData = {
	profit_dynamics: ProfitDynamicsItem[];
	trades_by_asset: TradeByAssetItem[];
	win_loss_ratio: WinLossRatio;
};

export enum BybitInterval {
	M1 = "1",
	M3 = "3",
	M5 = "5",
	M15 = "15",
	M30 = "30",
	H1 = "60",
	H2 = "120",
	H4 = "240",
	H6 = "360",
	H12 = "720",
	D = "D",
	W = "W",
	M = "M",
};

