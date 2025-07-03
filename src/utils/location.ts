import { Coordinates } from '@/types/location';
import { COORDINATE_REGEX, ZIPCODE_REGEX, AIRPORT_CODE_REGEX } from '@/constants/regex';
import { convertToDecimal } from '@/utils/number';

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

export const isCoordinate = (value: string): boolean => COORDINATE_REGEX.test(value);

export const isZipCode = (value: string): boolean => ZIPCODE_REGEX.test(value);

export const isAirportCode = (value: string): boolean => AIRPORT_CODE_REGEX.test(value);

export const isPopulatedArea = (value?: string): boolean => {
    if (!value) return false;
    return value.includes('ppl') || value.includes('adm');
};

export const formatCoordinates = ({ lat, lon }: Coordinates, precision = 3) => (
    `${convertToDecimal(lat, precision)}, ${convertToDecimal(lon, precision)}`
);
