import { SearchResult, SearchGroupType } from '@/types/search';
import { UseWeatherApiRequest } from '@/mapsgl/useWeatherApi';
import { WEATHER_API_ACTION } from '@/constants/weatherApi/action';
import { STATES, COUNTRIES } from '@/constants/location';
import { capitalizeWords, sanitizeText } from '@/utils/text';
import { isCoordinate, isZipCode } from '@/utils/location';

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

export const formatResult = (result: SearchResult) => {
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
