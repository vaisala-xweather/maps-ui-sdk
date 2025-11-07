import { Coordinates } from '@/types/location';

export interface Location {
    lat: number;
    long: number;
}

export interface Profile {
    code: string;
}

export interface Place {
    country: string;
    countryFull: string;
    state: string;
    name: string;
}

export interface WeatherStationSearchResult {
    id: string;
    loc: Location;
}

export interface WeatherPlaceSearchResult {
    loc: Location;
    place: Place;
    profile: Profile;
}

export type SearchQueryType = 'coordinate' | 'text' | 'zip' | 'airport';

/**
 * Describes how a result was requested so consumers can tailor the UX.
 * When type is `coordinate`, coordinates holds the exact
 * lat/lon the user entered (normalized to decimal degrees).
 */
export interface SearchQueryMeta {
    type: SearchQueryType;
    original: string;
    coordinates?: Coordinates;
}

export type SearchResult = (WeatherStationSearchResult | WeatherPlaceSearchResult) & {
    groupType?: SearchGroupType;
    trackingId?: string;
    queryMeta?: SearchQueryMeta;
};

export interface ApiResponse {
    response: SearchResult | SearchResult[];
    request: string;
}

export type SearchGroupType = 'recent' | 'stations' | 'places';

/**
 * Type guard that narrows a SearchResult to one with coordinate metadata.
 */
export const isCoordinateSearchResult = (
    result: SearchResult
): result is SearchResult & { queryMeta: SearchQueryMeta & { coordinates: Coordinates } } => (
    result.queryMeta?.type === 'coordinate' && Boolean(result.queryMeta.coordinates)
);
