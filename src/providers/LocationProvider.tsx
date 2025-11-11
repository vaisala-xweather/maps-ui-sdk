import {
    createContext,
    useContext,
    ReactNode
} from 'react';
import { useLocation } from '@/hooks/useLocation';
import type { UseLocationProps, UseLocationReturn } from '@/types/location';

export interface LocationProviderProps extends UseLocationProps {
  children: ReactNode
}

/**
 * Context value interface providing location state and actions.
 */
export type LocationContextValue = UseLocationReturn;

/**
 * Context for sharing location state across the component tree.
 */
export const LocationContext = createContext<LocationContextValue>({
    coordinates: null,
    formattedCoordinates: null,
    coordinatesString: null,
    setCoordinates: () => {
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                'setCoordinates was called outside of <LocationProvider>. This is a no-op.'
            );
        }
    }
});

/**
 * Hook for accessing location context values.
 * Safe to use outside LocationProvider - returns default values.
 */
export const useLocationContext = (): LocationContextValue => useContext(LocationContext);

/**
 * Provider component for location context, managing coordinate state and formatting.
 *
 * @param props - Configuration including initial coordinates, change handler, and formatters
 * @returns Provider component wrapping children with location context
 */
export const LocationProvider = ({
    coordinates,
    onChange,
    formatter,
    children
}: LocationProviderProps) => {
    const value = useLocation({
        coordinates,
        onChange,
        formatter
    });

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
