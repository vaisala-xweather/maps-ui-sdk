import { ReactNode } from 'react';
import { gradient } from '@/utils/color';
import { useColorRangeContext } from '@/providers/ColorRangeProvider';
import { ColorRangeBar } from './ColorRangeBar';

export interface ColorRangeGradientProps {
    minSlot?: ReactNode;
    maxSlot?: ReactNode;
}

export const ColorRangeGradient = ({ minSlot, maxSlot }: ColorRangeGradientProps) => {
    const { colorScale, colorScaleUnitConverter, min, max } = useColorRangeContext();
    const gradientString = gradient(min ?? 0, max ?? 0, colorScale, colorScaleUnitConverter, 1);

    return (
        <ColorRangeBar
            minSlot={minSlot}
            maxSlot={maxSlot}
            color={gradientString}
        />
    );
};
