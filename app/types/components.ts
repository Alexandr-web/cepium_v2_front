export type TInputType = "text" | "password";

export type TGeneralFormInput = {
    value: string;
    name: string;
    placeholder?: string;
    preppendIcon?: string;
    type?: TInputType;
    label?: string;
};
