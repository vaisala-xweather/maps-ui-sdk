import { ReactNode, createContext, useContext } from 'react';
import { HStack } from '@/components/primitives/layout/Stack';

export type ColorRangeEndpointValue = 'min' | 'max' | null;

export const ColorRangeEndpointContext = createContext<ColorRangeEndpointValue>(null);

export const useColorRangeEndpointContext = () => {
    const context = useContext(ColorRangeEndpointContext);
    if (context === null) {
        throw new Error('useRangeEndpointContext must be used within a RangeEndpointProvider');
    }
    return context;
};

export interface ColorRangeEndpointProviderProps {
    children: ReactNode;
    type: 'min' | 'max';
}

export const ColorRangeEndpointProvider = ({ children, type }: ColorRangeEndpointProviderProps) => (
    <ColorRangeEndpointContext.Provider value={type}>
        <HStack className="xw-relative xw-items-center">
            {children}
        </HStack>
    </ColorRangeEndpointContext.Provider>
);
