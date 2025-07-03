export interface BasePayload {
    id: string;
}

export interface ValuePayload extends BasePayload {
    value: string | number | string[] | number[];
}

export interface BaseAction {
    type: string;
}

export interface PayloadAction extends BaseAction {
    payload: BasePayload;
}

export interface ValueAction extends BaseAction {
    payload: ValuePayload;
}

export type Action = BaseAction | PayloadAction | ValueAction;

export type Dispatch<A extends BaseAction = BaseAction> = (value: A) => void;
