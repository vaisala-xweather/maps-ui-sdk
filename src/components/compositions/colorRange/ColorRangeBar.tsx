import { ReactNode } from 'react';
import { HStack } from '@/components/primitives/layout/Stack';
import { useDataContext } from '@/providers/DataProvider';
import { percent } from '@/utils/number';
import { pixels } from '@/utils/css';
import { useColorRangeContext } from '@/providers/ColorRangeProvider';
import { ColorRangeEndpointProvider } from './ColorRangeEndpointProvider';

export interface ColorRangeBarProps {
    minSlot?: ReactNode;
    maxSlot?: ReactNode;
    color?: string;
}

export const ColorRangeBar = ({ minSlot, maxSlot, color = '#E4E8F1' }: ColorRangeBarProps) => {
    const { data: offset } = useDataContext();
    const offsetInPixels = offset ?? 0;
    const { min = 0, max = 0, rangeMin, rangeMax, containerWidth = 0 } = useColorRangeContext();

    const baseBarWidthInPixels = 13;
    const slotWidthInPixels = 55;

    const barWidth = (minSlot
        ? percent(((max - min)), rangeMin, rangeMax)
        : percent((max - rangeMin), rangeMin, rangeMax));

    const barWidthDecimal = barWidth / 100;
    const barWidthInPixels = minSlot
        ? (barWidthDecimal * (containerWidth - (slotWidthInPixels * 2) - offsetInPixels))
        : (barWidthDecimal * (containerWidth - slotWidthInPixels - (baseBarWidthInPixels * 2)));

    return (
        containerWidth
        && <div
            className="xw-flex"
            style={{
                minWidth: pixels((barWidthDecimal * containerWidth) - 68)
            }}
        >
            <HStack className="xw-items-center xw-w-full xw-relative">
                {<ColorRangeEndpointProvider type="min">{minSlot}</ColorRangeEndpointProvider>}
                <div className="xw-w-full xw-mx-0.5 xw-h-1 xw-rounded-full xw-relative" style={{
                    background: color,
                    width: pixels(minSlot ? barWidthInPixels : barWidthInPixels + baseBarWidthInPixels)
                }} />
                <div className="xw-relative">
                    {<ColorRangeEndpointProvider type="max">{maxSlot}</ColorRangeEndpointProvider>}
                </div>
            </HStack>
        </div>
    );
};
