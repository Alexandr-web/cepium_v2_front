export type TUser = {
    name: string|null;
    avatar: string|null;
};

export enum TConnectionStatuses {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
};
