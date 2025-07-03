export const isString = (value: unknown): value is string => typeof value === 'string';

export const isObject = <T extends object>(value: unknown): value is T => typeof value === 'object' && value !== null;
