import { isNil } from '@aerisweather/javascript-utils';
import { LayerSchema } from '@/mapsgl/layerDataSchema';

type ValueConverter<T = any> = (value: any) => T;

const { paint: {
    sample,
    particle,
    grid,
    symbol,
    opacity
}, data } = LayerSchema;

export const VALUE_CONVERTERS = {
    toString: String as ValueConverter<string>,
    toNumber: Number as ValueConverter<number>,
    toBoolean: Boolean as ValueConverter<boolean>,
    toPercent: ((value: any) => Number(value) / 100) as ValueConverter<number>,
    fromPercent: ((value: any) => Number(value) * 100) as ValueConverter<number>,
    toSymbolSize: ((value: any) => ({
        width: Number(value),
        height: Number(value)
    })) as ValueConverter<{ width: number; height: number }>,
    toDrawRange: ((value: [number, number]) => ({
        min: value[0],
        max: value[1]
    })) as ValueConverter<{ min: number; max: number }>,
    toValue: (<T>(value: T) => value) as ValueConverter<any>
} as const;

// Mapping of layer properties to their conversion functions
export const MAPSGL_VALUE_CONVERTERS = {
    // Base paint properties
    [opacity]: VALUE_CONVERTERS.toPercent,

    // Sample
    [sample.expression]: VALUE_CONVERTERS.toString,
    [sample.channel]: VALUE_CONVERTERS.toString,
    [sample.quality]: VALUE_CONVERTERS.toString,
    [sample.interpolation]: VALUE_CONVERTERS.toString,
    [sample.smoothing]: VALUE_CONVERTERS.toNumber,
    [sample.colorscale.interval]: VALUE_CONVERTERS.toNumber,
    [sample.colorscale.interpolate]: VALUE_CONVERTERS.toBoolean,
    [sample.colorscale.normalized]: VALUE_CONVERTERS.toBoolean,
    [sample.multiband]: VALUE_CONVERTERS.toBoolean,
    [sample.offset]: VALUE_CONVERTERS.toNumber,
    [sample.meld]: VALUE_CONVERTERS.toBoolean,
    [sample.drawRange.min]: VALUE_CONVERTERS.toNumber,
    [sample.drawRange.max]: VALUE_CONVERTERS.toNumber,
    [sample.drawRangePath]: VALUE_CONVERTERS.toDrawRange,

    // Particle
    [particle.count]: VALUE_CONVERTERS.toNumber,
    [particle.density]: VALUE_CONVERTERS.toNumber,
    [particle.size]: VALUE_CONVERTERS.toNumber,
    [particle.speed]: VALUE_CONVERTERS.toNumber,
    [particle.trails]: VALUE_CONVERTERS.toBoolean,
    [particle.trailsFade]: VALUE_CONVERTERS.toBoolean,
    [particle.dropRate]: VALUE_CONVERTERS.toNumber,
    [particle.dropRateBump]: VALUE_CONVERTERS.toNumber,

    // Grid
    [grid.symbol]: VALUE_CONVERTERS.toString,
    [grid.spacing]: VALUE_CONVERTERS.toNumber,

    // Symbol
    [symbol.size]: VALUE_CONVERTERS.toSymbolSize,

    // Data
    [data.quality]: VALUE_CONVERTERS.toString
} as const;

export type MapsGLValueConverterKey = keyof typeof MAPSGL_VALUE_CONVERTERS;

export const isValidMapsGLLayerProperty = (key: string): key is keyof typeof MAPSGL_VALUE_CONVERTERS => (
    key in MAPSGL_VALUE_CONVERTERS
);

export type ConvertedValue<K extends keyof typeof MAPSGL_VALUE_CONVERTERS> =
    ReturnType<typeof MAPSGL_VALUE_CONVERTERS[K]>;

export const convertToMapsGLValue = <K extends keyof typeof MAPSGL_VALUE_CONVERTERS>(
    key: K,
    value: any
): ConvertedValue<K> | undefined => {
    if (isNil(key)) {
        return undefined;
    }

    const converter = MAPSGL_VALUE_CONVERTERS[key];

    if (!converter || isNil(value)) {
        return undefined;
    }

    return converter(value) as ConvertedValue<K>;
};
