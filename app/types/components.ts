import type { Component, InputTypeHTMLAttribute } from "vue";
import type z from "zod";

export type TGeneralFormField = {
	value: string|number|boolean|string[]|null|File;
	name: string;
	placeholder?: string;
	preppendIcon?: string;
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
};

export type TSelectItem = {
	label: string;
	value: string;
};
