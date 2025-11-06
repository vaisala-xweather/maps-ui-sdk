import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Coordinates, UseLocationProps, UseLocationReturn } from '@/types/location';
import { formatCoordinates } from '@/utils/location';

const coordinatesAreEqual = (
    coordinatesA: Coordinates | null,
    coordinatesB: Coordinates | null
): boolean => {
    if (coordinatesA === coordinatesB) return true;
    if (!coordinatesA || !coordinatesB) return false;
    return coordinatesA.lat === coordinatesB.lat && coordinatesA.lon === coordinatesB.lon;
};

/**
 * Manages location coordinates with formatting and a change callback.
 */
export const useLocation = ({
    coordinates,
    onChange,
    formatter
}: UseLocationProps): UseLocationReturn => {
    const [value, setValue] = useState<Coordinates | null>(coordinates ?? null);

    useEffect(() => {
        if (!coordinatesAreEqual(coordinates ?? null, value)) {
            setValue(coordinates ?? null);
        }
    }, [coordinates]);

    const formattedCoordinates = useMemo(
        () => (value && formatter ? formatter(value) : null),
        [value, formatter]
    );

    const coordinatesString = useMemo(
        () => (value ? formatCoordinates(value) : null),
        [value]
    );

    const setCoordinates = useCallback((nextCoordinates: Coordinates | null) => {
        setValue((prev) => (
            coordinatesAreEqual(prev, nextCoordinates) ? prev : nextCoordinates
        ));
    }, []);

    useEffect(() => {
        if (onChange) onChange(value);
    }, [value, onChange]);

    return useMemo(() => ({
        coordinates: value,
        formattedCoordinates,
        coordinatesString,
        setCoordinates
    }), [value, formattedCoordinates, coordinatesString, setCoordinates]);
};
