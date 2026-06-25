import type { Component } from "vue";
import type z from "zod";

export type TInputType = "text" | "password";
export type TSummaryType = "balance" | "pnl" | "positions";

export type TGeneralFormField = {
    value: string;
    name: string;
    placeholder?: string;
    preppendIcon?: string;
    component?: Component;
    type?: TInputType;
    label?: string;
    check?: z.ZodType;
    error?: string;
};

export type TIndexCardSummary = {
    title: string;
    icon?: string;
    value: number|string;
    type: TSummaryType;
};
