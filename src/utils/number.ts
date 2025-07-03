import { isNil } from '@aerisweather/javascript-utils';

interface ListItem {
    [key: string]: number;
}

interface RangeMinMax {
    rangeMin: number | null;
    rangeMax: number | null;
}

export const percent = (value: number, min: number, max: number): number => {
    const range = max - min;
    if (range === 0) {
        return 0;
    }
    const pos = value / (max - min);
    return Math.round((pos * 100) * 100) / 100;
};

export const calculateProgressRatio = (start: number, range: number, current: number): number => {
    const progressDelta = current - start;
    return progressDelta / range;
};

/**
 * Converts a value (number or string) to a specified number of decimal places.
 * If the input value is not a valid number or a string representation of a number,
 * the original value is returned unchanged.
 *
 * @param value - The value to be converted (number, string, or undefined)
 * @param decimalPlaces - The number of decimal places to round to (default is 2)
 * @returns The converted value as a number or string, or the original value if it's not a valid number
 * @throws {Error} If the input value is null or undefined
 */
export const convertToDecimal = (value: number | string | undefined, decimalPlaces = 2): number | string => {
    if (value === null || value === undefined) {
        throw new Error('Value must be a number or string');
    }

    if (typeof value === 'string') {
        const parsedValue = Number.parseFloat(value);

        if (Number.isNaN(parsedValue)) {
            return value;
        }
        value = parsedValue;
    }

    if (typeof value === 'number' && !Number.isNaN(value)) {
        const factor = 10 ** decimalPlaces;
        const roundedValue = Math.round(value * factor) / factor;
        return roundedValue;
    }

    return value;
};

export const calculateRangeMinMax = <T extends ListItem>(list: T[], minKey: keyof T, maxKey: keyof T): RangeMinMax => {
    if (isNil(list) || list?.length === 0) {
        return { rangeMin: null, rangeMax: null };
    }

    return list.reduce<RangeMinMax>((accumulator, current) => ({
        rangeMin: Math.min(accumulator.rangeMin === null
            ? Number.POSITIVE_INFINITY
            : accumulator.rangeMin, current[minKey]),
        rangeMax: Math.max(accumulator.rangeMax === null
            ? Number.NEGATIVE_INFINITY
            : accumulator.rangeMax, current[maxKey])
    }), { rangeMin: null, rangeMax: null });
};

export const safeRound = (num?: number | undefined): number | undefined => {
    if (num === undefined) {
        return num;
    }
    return Math.round(num);
};
