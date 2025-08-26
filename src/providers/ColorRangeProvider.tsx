import React, { createContext, ReactNode, useContext } from 'react';
import { ColorScaleStops, ColorScaleUnitConverter } from '@/types/colors';
import { useColorScale } from '@/hooks/useColorScale';

export interface ColorRangeContextValue {
    rangeMin: number;
    rangeMax: number;
    min?: number;
    max?: number;
    colorScale: chroma.Scale<chroma.Color>;
    colorScaleUnitConverter: ColorScaleUnitConverter | undefined;
    containerWidth: number | undefined;
}

export const ColorRangeContext = createContext<ColorRangeContextValue | null>(null);

export const useColorRangeContext = () => {
    const context = useContext(ColorRangeContext);
    if (context === null) {
        throw new Error('useColorRangeContext must be used within a ColorRangeProvider');
    }
    return context;
};

export interface ColorRangeProviderProps {
    children: ReactNode;
    min?: number;
    max?: number;
    rangeMin: number;
    rangeMax: number;
    colorScale: ColorScaleStops;
    colorScaleUnitConverter?: ColorScaleUnitConverter;
    containerWidth?: number;
}

export const ColorRangeProvider: React.FC<ColorRangeProviderProps> = ({
    children,
    min,
    max,
    rangeMin,
    rangeMax,
    colorScale,
    colorScaleUnitConverter,
    containerWidth
}) => {
    const effectiveColorScale = useColorScale(colorScale);

    const contextValue: ColorRangeContextValue = {
        min,
        max,
        rangeMin,
        rangeMax,
        colorScale: effectiveColorScale,
        colorScaleUnitConverter,
        containerWidth
    };

    return (
        <ColorRangeContext.Provider value={contextValue}>
            {children}
        </ColorRangeContext.Provider>
    );
};
