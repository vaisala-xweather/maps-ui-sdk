import { EVENT } from '@/constants/action';

/**
 * A generic action type for updating a specific key of the given state `T`.
 * @template T - The state object type.
 * @template K - The key of the state being updated.
 */
export type UpdateValueAction<T, K extends keyof T> = {
    type: typeof EVENT.updateValue;
    payload: {
        /** The key of the setting to update. */
        id: K;
        /** The new value for that setting. */
        value: T[K];
    };
};

/**
 * A value action that updates one of the keys in `T`. It's a generic action
 * that doesn't assume any specific keys, making it flexible for any type of
 * state `T`.
 * @template T - The state object type.
 */
export type ValueAction<T> = UpdateValueAction<T, keyof T>;
