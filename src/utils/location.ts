import { Coordinates } from '@/types/location';
import { COORDINATE_REGEX, ZIPCODE_REGEX, AIRPORT_CODE_REGEX, BRACKETS_TRIM_REGEX } from '@/constants/regex';
import { convert as convertGeoCoordinates } from 'geo-coordinates-parser';

/**
 * Validates that latitude and longitude are within valid ranges.
 * @param lat - Latitude value
 * @param lon - Longitude value
 * @returns true if both values are valid numbers within their respective ranges
 */
const isValidCoordinateRange = (lat: number, lon: number): boolean => (
    Number.isFinite(lat) && Number.isFinite(lon)
    && lat >= -90 && lat <= 90
    && lon >= -180 && lon <= 180
);

/**
 * Gets the current location from the browser's geolocation API.
 * @returns The current location as a Coordinates object
 */
export const getCurrentLocation = async (): Promise<Coordinates> => {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
    }

    try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        });

        return {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
    } catch (error) {
        if (error instanceof GeolocationPositionError) {
            throw new TypeError(`Geolocation error: ${error.message}`);
        }
        throw error;
    }
};

export const sanitizeCoordinatesInput = (raw: string): string => raw.trim().replaceAll(BRACKETS_TRIM_REGEX, '');

/**
 * Parses a string into a Coordinates object.
 * @param value - The string to parse
 * @returns The Coordinates object or null if the string is not a valid coordinate
 */
export const parseCoordinates = (value: string): Coordinates | null => {
    if (!value) return null;

    const input = sanitizeCoordinatesInput(value);

    const decimalDegreesMatch = input.match(COORDINATE_REGEX);
    if (decimalDegreesMatch) {
        const lat = Number(decimalDegreesMatch[1]);
        const lon = Number(decimalDegreesMatch[2]);
        if (isValidCoordinateRange(lat, lon)) {
            return { lat, lon };
        }
    }

    try {
        const parsed = convertGeoCoordinates(input);
        if (parsed?.decimalLatitude && parsed?.decimalLongitude) {
            const lat = Number(parsed.decimalLatitude);
            const lon = Number(parsed.decimalLongitude);
            if (isValidCoordinateRange(lat, lon)) {
                return { lat, lon };
            }
        }
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Coordinate parsing failed for input:', input, error);
        }
    }

    return null;
};

export const isCoordinate = (value: string): boolean => Boolean(parseCoordinates(value));

export const isZipCode = (value: string): boolean => ZIPCODE_REGEX.test(value);

export const isAirportCode = (value: string): boolean => AIRPORT_CODE_REGEX.test(value);

export const isPopulatedArea = (value?: string): boolean => {
    if (!value) return false;
    return value.includes('ppl') || value.includes('adm');
};

export const formatCoordinates = ({ lat, lon }: Coordinates, precision = 6) => (
    `${Number(lat).toFixed(precision)}, ${Number(lon).toFixed(precision)}`
);
