import type { Component, InputTypeHTMLAttribute } from "vue";
import type z from "zod";

export type TSummaryType = "balance" | "pnl" | "positions";

export type TGeneralFormField = {
    value: string;
    name: string;
    placeholder?: string;
    preppendIcon?: string;
    component?: Component;
    label?: string;
    check?: z.ZodType;
    error?: string;
    type?: InputTypeHTMLAttribute;
};

export type TIndexCardSummary = {
    title: string;
    icon?: string;
    value: number|string;
    type: TSummaryType;
};
