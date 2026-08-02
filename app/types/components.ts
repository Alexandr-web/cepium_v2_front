import type { Component, InputTypeHTMLAttribute } from "vue";
import type z from "zod";

export type TGeneralFormField = {
	value: string|number|boolean|string[]|null|File;
	name: string;
	placeholder?: string;
	prependIcon?: string;
	component?: Component;
	label?: string;
	check?: z.ZodType;
	error?: string;
	type?: InputTypeHTMLAttribute;
	items?: TSelectItem[];
	disabled?: boolean;
	search?: (value: string) => Promise<TSelectItem[]>;
	showTooltip?: string;
	min?: number;
	max?: number;
	size?: string;
	format?: object|((v: number) => unknown);
	classes?: string;
};

export type TIndexCardSummary = {
	title: string;
	icon?: string;
	value: number|string;
	formattedValue: number|string;
	type: "balance" | "pnl" | "positions";
};

export type TTableColumn<T> = {
  key: keyof T | "controls" | "index";
  label: string;
  align?: "left" | "center" | "right";
  normalizer?: (val: number | string | T[keyof T]) => string;
};

export type TSelectItem = {
	label: string;
	value: string;
};

export type TFilterItem = {
	component: Component;
	label: string;
	value: string|string[];
	items?: TSelectItem[];
};

export type TStatisticsCard = {
	id: string;
	title: string;
	icon?: string;
	classesValue?: string;
	normalizer?: (value: string|number) => string;
	value: string|number;
};
