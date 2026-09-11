import type { Component, InputTypeHTMLAttribute } from "vue";
import type z from "zod";

export type GeneralFormField = {
	value: string | number | boolean | string[] | null | File;
	name: string;
	placeholder?: string;
	prependIcon?: string;
	component?: Component;
	label?: string;
	check?: z.ZodType;
	error?: string;
	type?: InputTypeHTMLAttribute;
	items?: SelectItem[];
	disabled?: boolean;
	search?: (value: string) => Promise<SelectItem[]>;
	itemClickHandler?: (item: SelectItem) => Promise<void>;
	showTooltip?: string;
	min?: number;
	max?: number;
	size?: string;
	format?: object | ((v: number) => unknown);
	classes?: string;
	tooltipText?: string;
};

export type IndexCardSummary = {
	title: string;
	icon?: string;
	value: number | string;
	formattedValue: number | string;
	type: "balance" | "pnl" | "positions";
};

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
	classesValue?: string;
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
};

export enum FormMode {
	DEFAULT = "default",
	GRID = "grid",
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
