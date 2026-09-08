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
	normalizer?: (val: number | string | T[keyof T]) => string;
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
