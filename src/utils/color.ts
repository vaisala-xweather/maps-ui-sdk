import { Scale, Color } from 'chroma-js';
import { ColorScale, ColorScaleUnitConverter } from '@/types/colors';

export const extractScaleComponents = (scale: ColorScale): { values: number[], colors: string[] } => {
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

export const gradientFromColorStops = (colorStops: ColorScale) => {
    const count = colorStops.length / 2;
    const gradient: string[] = [];

    for (let i = 0; i < count; i++) {
        const color = colorStops[i * 2 + 1];
        const pos = i / count;
        gradient.push(`${color} ${pos * 100}%`);
    }
    return `linear-gradient(to right, ${gradient.join(', ')})`;
};

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
