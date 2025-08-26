import { useMemo } from 'react';
import { scale } from 'chroma-js';
import { ColorScaleStops } from '@/types/colors';
import { extractScaleComponents } from '@/utils/color';

export const useColorScale = (colorScale: ColorScaleStops) => useMemo(() => {
    const { values, colors } = extractScaleComponents(colorScale);
    return scale(colors).domain(values);
}, [colorScale]);
