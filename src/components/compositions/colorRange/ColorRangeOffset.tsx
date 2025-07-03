import { ReactNode } from 'react';
import { HStack } from '@/components/primitives/layout/Stack';
import { DataProvider } from '@/providers/DataProvider';
import { percent } from '@/utils/number';
import { pixels } from '@/utils/css';
import { useColorRangeContext } from '@/providers/ColorRangeProvider';

export interface ColorRangeOffsetProps {
    children: ReactNode;
}

export const ColorRangeOffset = ({ children }: ColorRangeOffsetProps) => {
    const { min = 0, rangeMin, rangeMax, containerWidth = 0 } = useColorRangeContext();
    const maxOffset = containerWidth / 2;
    const leftOffset = percent((min - rangeMin), rangeMin, rangeMax);
    const leftOffsetInPixels = ((leftOffset) / 100) * (maxOffset) * 0.9;

    return (
        <HStack
            className="xw-relative"
            style={{ left: pixels(leftOffsetInPixels) }}>
            <DataProvider data={maxOffset}>
                {children}
            </DataProvider>
        </HStack>
    );
};
