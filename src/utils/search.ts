import { SearchResult, SearchGroupType, SearchQueryMeta, Location } from '@/types/search';
import { UseWeatherApiRequest } from '@/mapsgl/useWeatherApi';
import { WEATHER_API_ACTION } from '@/constants/weatherApi/action';
import { STATES, COUNTRIES } from '@/constants/location';
import { capitalizeWords, sanitizeText } from '@/utils/text';
import { isCoordinate, isZipCode, isAirportCode, parseCoordinates, formatCoordinates } from '@/utils/location';
import { Coordinates } from '@/types/location';

/**
 * Converts SDK Coordinates (lat, lon) to API Location (lat,long).
 * Use when synthesizing SearchResults from parsed coordinates.
 */
export const coordinatesToLocation = (coords: Coordinates): Location => ({
    lat: coords.lat,
    long: coords.lon
});

/**
 * Classifies the raw user query so higher layers can understand intent
 * (coordinate vs text, etc.) without duplicating parsing logic.
 */
export const getSearchQueryMeta = (rawQuery: string): SearchQueryMeta | undefined => {
    const original = rawQuery;
    const query = rawQuery.trim();

    if (!query) return undefined;

    if (isCoordinate(query)) {
        const coordinates = parseCoordinates(query);
        if (coordinates) {
            return {
                type: 'coordinate',
                original,
                coordinates
            } satisfies SearchQueryMeta;
        }
    }

    if (isAirportCode(query)) {
        return {
            type: 'airport',
            original
        } satisfies SearchQueryMeta;
    }

    if (isZipCode(query)) {
        return {
            type: 'zip',
            original
        } satisfies SearchQueryMeta;
    }

    return {
        type: 'text',
        original
    } satisfies SearchQueryMeta;
};

export const getMatches = (data: Record<string, string>, value: string): string[] => {
    const regex = new RegExp(`^${value}`, 'i');
    return Object.keys(data).filter((key) => regex.test(data[key]));
};

export const createStateOrCountryQuery = (val: string): string => {
    if (val.length <= 1) {
        const countryList = 'gb,uk,us,ca,au'.split(',')
            .map((c) => `country:^${c}`)
            .join(';');
        return `,state:^${val};${countryList}`;
    }

    const states = { ...STATES.us, ...STATES.ca };
    const stateMatches = getMatches(states, val);
    const countryMatches = getMatches(COUNTRIES, val);

    let queryString = `,state:^${val};country:^${val}`;

    if (stateMatches.length > 0) {
        queryString += stateMatches.map((s) => `;state:^${s}`).join('');
    }
    if (countryMatches.length > 0) {
        queryString += countryMatches.map((c) => `;country:^${c}`).join('');
    }

    return queryString;
};

export const createObservationsRequest = (query: string): UseWeatherApiRequest => ({
    endpoint: 'observations',
    action: WEATHER_API_ACTION.search,
    params: {
        query: `id:^${query.toUpperCase()},datasource:!MADIS_METAR,datasource:!MADIS_HFMETAR,trustfactor:0,qccode:10`,
        limit: 10,
        filter: 'metar;pws;madis;ausbom,allownosky',
        fields: 'id,loc'
    }
});

export const createLocationRequest = (query: string): UseWeatherApiRequest => {
    const parts = query.trim().split(',').map((part) => part.trim());
    const queryString = `name:${parts[0]};altname:${parts[0]}`;

    const buildQuery = (): string => {
        if (parts.length === 1) {
            const location = parts[0];
            return `name:^${location};altname:${location}`;
        }

        if (parts.length === 2 && parts[1]) {
            return queryString + createStateOrCountryQuery(parts[1]);
        }

        if (parts.length === 3) {
            const [location, state, country] = parts;
            return `name:^${location},state:${state},country:${country}`;
        }

        return '';
    };

    return {
        endpoint: 'places',
        action: WEATHER_API_ACTION.search,
        params: {
            query: buildQuery(),
            limit: 10,
            sort: 'pop:-1,haszip:-1,name:1'
        }
    };
};

export const prepareRequest = (
    query: string,
    searchGroups: SearchGroupType[] = ['places', 'stations']
): UseWeatherApiRequest[] => {
    if (!query?.trim()) return [];

    const sanitizedQuery = sanitizeText(query);
    const requests: UseWeatherApiRequest[] = [];

    if (isCoordinate(sanitizedQuery)) {
        requests.push({
            endpoint: 'places',
            action: WEATHER_API_ACTION.closest,
            params: { p: sanitizedQuery }
        });
        return requests;
    }

    if (isZipCode(sanitizedQuery)) {
        requests.push({
            endpoint: 'places',
            params: { p: sanitizedQuery }
        });
        return requests;
    }

    if (searchGroups.includes('stations')) {
        requests.push(createObservationsRequest(sanitizedQuery));
    }

    if (searchGroups.includes('places')) {
        requests.push(createLocationRequest(sanitizedQuery));
    }

    return requests;
};

/**
 * Default label generator used by the Search component.
 * Coordinate queries surface the normalized coordinates by default.
 * Consumers can provide their own formatter to display nearest place instead.
 */
export const formatResult = (result: SearchResult, precision = 6) => {
    const coordinates = result.queryMeta?.type === 'coordinate'
        ? result.queryMeta.coordinates
        : undefined;

    if (coordinates) {
        return formatCoordinates(coordinates, precision);
    }

    if ('place' in result) {
        const { place } = result;
        const parts = [
            capitalizeWords(place.name),
            place.state ? place.state.toUpperCase() : null,
            place.country === 'US' ? null : capitalizeWords(place.countryFull)
        ].filter(Boolean);

        return parts.join(', ');
    }

    // primarily for stations
    if ('id' in result) {
        return result.id.replace(/^.*?_/, '');
    }

    return '';
};
