import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Coordinates, UseLocationProps } from '@/types/location';
import { formatCoordinates } from '@/utils/location';

const coordinatesAreEqual = (
    coordinatesA?: Coordinates,
    coordinatesB?: Coordinates
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
}: UseLocationProps) => {
    const [value, setValue] = useState<Coordinates | undefined>(coordinates);

    useEffect(() => {
        if (!coordinatesAreEqual(coordinates, value)) {
            setValue(coordinates);
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

    const setCoordinates = useCallback((nextCoordinates: Coordinates) => {
        setValue((prev) => (
            coordinatesAreEqual(prev, nextCoordinates) ? prev : nextCoordinates
        ));
    }, []);

    useEffect(() => {
        if (value && onChange) onChange(value);
    }, [value, onChange]);

    return useMemo(() => ({
        coordinates: value,
        formattedCoordinates,
        coordinatesString,
        setCoordinates
    }), [value, formattedCoordinates, coordinatesString, setCoordinates]);
};
