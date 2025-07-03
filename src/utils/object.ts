/* eslint-disable max-len */
import { Optional } from '@/types/base';

type ComplexObject = Record<string, any>;

export const isObject = (obj: any) => obj && typeof obj === 'object';

export const updateButtonGroup = (selectedState: any, id: string, multiselect: boolean, updateKey: string): any => Object
    .keys(selectedState)
    .reduce((updatedSelectedState: Record<string, boolean | undefined>, key: string) => {
        if (multiselect) {
            const currentSelectedState = selectedState[key][updateKey];
            const updatedState = { [updateKey]: key === id ? !currentSelectedState : currentSelectedState };
            updatedSelectedState[key] = { ...selectedState[key], ...updatedState };
        } else {
            updatedSelectedState[key] = { ...selectedState[key], [updateKey]: key === id };
        }
        return updatedSelectedState;
    }, {});

export const get = <T extends object, K extends keyof T>(obj: T, key: K): Optional<T[K]> => obj[key];

export const deepGet = (obj: object, path: string): Optional<any> => path
    .split('.')
    .reduce((o: Optional<any>, k: string) => (o && typeof o === 'object' ? get(o as any, k) : undefined), obj);

export const deepMerge = (target: ComplexObject, source: ComplexObject, isChecking: Set<any> = new Set()): ComplexObject => {
    if (!isObject(target) || !isObject(source)) return source;

    if (isChecking.has(source)) throw new Error('Circular reference detected in source object');

    isChecking.add(source);

    Object.entries(source).forEach(([key, value]) => {
        const targetValue = target[key];

        if (Array.isArray(value)) {
            target[key] = [...value];
        } else if (isObject(targetValue) && isObject(value)) {
            target[key] = deepMerge({ ...targetValue }, value, isChecking);
        } else {
            target[key] = value;
        }
    });

    isChecking.delete(source);

    return target;
};

type JsonObject = { [key: string]: any };

export const getObjectUpdatedByPath = (object: JsonObject, path: string, value: any): JsonObject => {
    const parts = path.split('.');
    parts.reduce((accumulator: any, part: string, index) => {
        if (index === parts.length - 1) {
            accumulator[part] = isObject(accumulator[part]) && isObject(value)
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
