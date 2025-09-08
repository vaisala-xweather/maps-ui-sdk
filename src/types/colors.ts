import { ColorScaleOptions } from '@xweather/mapsgl';
import { NORMALIZED_COLOR_SCALES } from '@/constants/colors';

export type ColorScaleStops = (number | string)[];

export type ColorScaleUnitConverter = ((value: number) => number) | undefined;

export type NormalizedColorScaleName = keyof typeof NORMALIZED_COLOR_SCALES;

/**
 * Type guard to validate if an object conforms to ColorScaleOptions.
 *
 * A color scale is a range of colors that represent a range of data values and is used to visualize data
 * in a way that makes it easy to understand and interpret. Ensuring that a color scale conforms to
 * the expected structure prevents runtime errors during data visualization.
 *
 * @param value - The value to check.
 * @returns True if the value conforms to ColorScaleOptions, false otherwise.
 */
export const isColorScaleOptions = (value: unknown): value is ColorScaleOptions => {
    if (typeof value !== 'object' || value === null) return false;

    const scale = value as ColorScaleOptions;

    return (
        (!scale.range || (typeof scale.range === 'object' && 'min' in scale.range && 'max' in scale.range))
        && (!scale.stops || Array.isArray(scale.stops))
        && (!scale.positions || Array.isArray(scale.positions))
        && (!scale.breaks || Array.isArray(scale.breaks) || typeof scale.breaks === 'function')
        && (scale.interval === undefined || typeof scale.interval === 'number')
        && (scale.normalized === undefined || typeof scale.normalized === 'boolean')
        && (scale.interpolate === undefined || typeof scale.interpolate === 'boolean')
        && (!scale.masks || Array.isArray(scale.masks))
    );
};

/**
 * Type guard to validate if an object is a record of ColorScaleOptions.
 *
 * @param value - The value to validate.
 * @returns True if the value is a Record<string, ColorScaleOptions>, false otherwise.
 */
export const isColorScalesRecord = (value: unknown): value is Record<string, ColorScaleOptions> => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    return Object.entries(value).every(([key, scale]) => {
        if (typeof key !== 'string') {
            return false;
        }
        return isColorScaleOptions(scale);
    });
};
