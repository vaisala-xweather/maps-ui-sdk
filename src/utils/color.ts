import type { CSSProperties } from 'react';
import chroma, { type Scale, type Color } from 'chroma-js';
import type { ColorScaleOptions } from '@xweather/mapsgl';
import { ColorScaleStops, ColorScaleUnitConverter } from '@/types/colors';
import { percent } from '@/utils/number';

export const extractScaleComponents = (scale: ColorScaleStops): { values: number[], colors: string[] } => {
    const values: number[] = [];
    const colors: string[] = [];

    scale.forEach((element, index) => {
        if (index % 2 === 0) {
            values.push(element as number);
        } else {
            colors.push(element as string);
        }
    });

    return { values, colors };
};

export const getHexCodeFromColorScale = (
    value: number | undefined,
    colorScale: Scale<Color> | null,
    colorScaleUnitConverter?: ColorScaleUnitConverter
) => (
    colorScale
        ? colorScale(
            colorScaleUnitConverter && typeof value === 'number'
                ? colorScaleUnitConverter(value)
                : value
        ).hex()
        : undefined
);

export const gradient = (
    min: number,
    max: number,
    colorScale: Scale<Color> | null,
    colorScaleUnitConverter: ColorScaleUnitConverter,
    interval = 1
) => {
    const colorStops: string[] = [];
    let value = min;

    while (value <= max) {
        const color = getHexCodeFromColorScale(value, colorScale, colorScaleUnitConverter);
        if (color) {
            colorStops.push(color);
        }
        value += interval;
    }
    return `linear-gradient(to right, ${colorStops.join(', ')})`;
};

/**
 * Creates CSS background properties for gradient preview
 */
const createGradientBackgroundStyle = (gradientImage: string): CSSProperties => ({
    backgroundImage: gradientImage,
    backgroundSize: '100% 100%',
    backgroundPosition: '0 0',
    backgroundRepeat: 'no-repeat'
});

export const extractPositionColorPairs = (
    stops: ColorScaleStops
): Array<{ position: number; color: string }> => {
    const pairs: Array<{ position: number; color: string }> = [];
    for (let i = 0; i < stops.length; i += 2) {
        pairs.push({
            position: stops[i] as number,
            color: stops[i + 1] as string
        });
    }
    return pairs;
};

/** Decide the numeric domain that chroma should map to 0-1 */
export const getDomain = (
    positions: number[],
    options: ColorScaleOptions
): [number, number] => {
    const { normalized, range } = options;
    if (normalized) return [0, 1];
    if (range) return [range.min, range.max];

    return [Math.min(...positions), Math.max(...positions)];
};

interface PositionColorPair {
    position: number;
    color: string;
}

const filterVisibleColors = (pairs: PositionColorPair[]): PositionColorPair[] => (
    pairs.filter(({ position, color }) => Number.isFinite(position) && !isTransparentColor(color))
);

const deduplicateByPosition = (pairs: PositionColorPair[]): PositionColorPair[] => {
    const positionToColorMap = new Map<number, string>();
    pairs.forEach(({ position, color }) => positionToColorMap.set(position, color));

    return [...positionToColorMap.entries()]
        .sort(([positionA], [positionB]) => positionA - positionB)
        .map(([position, color]) => ({ position, color }));
};

const createEvenlySpacedGradient = (pairs: PositionColorPair[]): string => {
    const uniqueColors = pairs
        .map(({ color }) => chroma(color).hex())
        .filter((hexColor, index, colors) => index === 0 || hexColor !== colors[index - 1]);

    // Ensure at least two stops for robust browser rendering
    const safeColors = uniqueColors.length === 1
        ? [uniqueColors[0], uniqueColors[0]]
        : uniqueColors;

    const colorStops = safeColors.map((hexColor, index) => (
        `${hexColor} ${percent(index, 0, safeColors.length - 1)}%`
    ));

    return `linear-gradient(to right, ${colorStops.join(', ')})`;
};

const createPositionBasedGradient = (
    pairs: PositionColorPair[],
    minimumPosition: number,
    positionSpan: number
): string => {
    const colorStops = pairs.map(({ position, color }) => {
        const percentage = Math.max(0, Math.min(100, percent(position - minimumPosition, 0, positionSpan)));
        return `${chroma(color).hex()} ${percentage}%`;
    });

    return `linear-gradient(to right, ${colorStops.join(', ')})`;
};

/**
 * Creates a gradient from a color scale.
 * @param colorScale - The color scale to create a gradient from.
 * @returns A string representing the gradient.
 */
export const gradientFromColorStops = (colorScale: ColorScaleOptions): string => {
    const { stops } = colorScale;
    if (!stops || stops.length === 0) return '';

    const rawPositionColorPairs = extractPositionColorPairs(stops);
    const visiblePairs = filterVisibleColors(rawPositionColorPairs);
    if (visiblePairs.length === 0) return '';

    const deduplicatedPairs = deduplicateByPosition(visiblePairs);
    const positions = deduplicatedPairs.map(({ position }) => position);
    const [minimumPosition, maximumPosition] = getDomain(positions, colorScale);
    const positionSpan = maximumPosition - minimumPosition;

    if (positionSpan <= 0) {
        return createEvenlySpacedGradient(deduplicatedPairs);
    }

    return createPositionBasedGradient(deduplicatedPairs, minimumPosition, positionSpan);
};

/**
 * Builds gradient preview style from ColorScaleOptions
 * @param colorScale - The color scale to create a gradient from.
 * @returns A CSSProperties object representing the gradient preview style.
 */
export const previewStyleFromScale = (colorScale?: ColorScaleOptions): CSSProperties => {
    if (!colorScale) return {};

    const { masks, stops } = colorScale;

    if (masks && masks.length > 0) {
        const firstMask = masks.find((mask) => mask.colorscale?.stops && mask.colorscale.stops.length > 0);

        if (firstMask?.colorscale) {
            return createGradientBackgroundStyle(gradientFromColorStops(firstMask.colorscale));
        }
    }

    if (stops && stops.length > 0) {
        return createGradientBackgroundStyle(gradientFromColorStops(colorScale));
    }

    return {};
};

/** guard for plain CSS color strings */
export const isCssColor = (value?: string): boolean => typeof value === 'string' && chroma.valid(value.trim());

/**
 * Uses chroma.js for color validation and transparency detection
 */
export const isTransparentColor = (color: string): boolean => (
    chroma.valid(color.trim()) && chroma(color.trim()).alpha() === 0
);

/**
 * Extracts only the essential color scale properties (stops or masks) from a full ColorScaleOptions object.
 * This prevents overriding other properties like interval, range, etc. during color scale updates.
 */
export const extractColorScaleStopsOrMasks = (
    colorScale?: ColorScaleOptions
): Pick<ColorScaleOptions, 'stops' | 'masks'> | undefined => {
    if (!colorScale) return undefined;

    if (colorScale.stops) {
        return { stops: colorScale.stops };
    }

    if (colorScale.masks) {
        return { masks: colorScale.masks };
    }

    return undefined;
};
