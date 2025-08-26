/* eslint-disable max-len */
import { Optional } from '@/types/base';
import { deepMerge } from '@/utils/deepMerge';

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    if (value === null || typeof value !== 'object') {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
};

export const get = <T extends object, K extends keyof T>(obj: T, key: K): Optional<T[K]> => obj[key];

export const deepGet = (obj: object, path: string): Optional<any> => path
    .split('.')
    .reduce((o: Optional<any>, k: string) => (o && typeof o === 'object' ? get(o as any, k) : undefined), obj);

type JsonObject = { [key: string]: any };

export const getObjectUpdatedByPath = (object: JsonObject, path: string, value: any): JsonObject => {
    const parts = path.split('.');
    parts.reduce((accumulator: any, part: string, index) => {
        if (index === parts.length - 1) {
            accumulator[part] = isPlainObject(accumulator[part]) && isPlainObject(value)
                ? deepMerge(accumulator[part], value)
                : value;
            return accumulator[part];
        }
        if (!(part in accumulator)) {
            accumulator[part] = {};
        }
        return accumulator[part];
    }, object);

    return object;
};

export const createObjectWithKeysAsValues = <T extends object>(object: T): { [K in keyof T]: K } => {
    const keys = Object.keys(object) as (keyof T)[];
    const result: Partial<{ [K in keyof T]: K }> = {};
    keys.forEach((key) => {
        result[key] = key;
    });
    return result as { [K in keyof T]: K };
};

// TODO: look into why isEmpty from @aerisweather/javascript-utils
// isn't working correctly and remove below isEmpty function when it's fixed

export const isEmpty = (value: string | any[] | object | null | undefined): boolean => {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string' || Array.isArray(value)) {
        return value.length === 0;
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    return false;
};
