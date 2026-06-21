export type TInputType = "text" | "password";
export type TSummaryType = "balance" | "pnl" | "positions";

export type TGeneralFormInput = {
    value: string;
    name: string;
    placeholder?: string;
    preppendIcon?: string;
    type?: TInputType;
    label?: string;
};

export type TIndexCardSummary = {
    title: string;
    icon?: string;
    value: number|string;
    type: TSummaryType;
};
