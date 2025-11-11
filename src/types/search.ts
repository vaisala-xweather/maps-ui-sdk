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
    relativeTo?: RelativeTo;
}

export interface RelativeTo {
    lat: number;
    long: number;
    bearing: number;
    bearingENG: string;
    distanceKM: number;
    distanceMI: number;
}

export type SearchQueryType = 'coordinate' | 'text' | 'zip' | 'airport';

/**
 * Describes how a result was requested.
 */
export interface SearchQueryMeta {
    type: SearchQueryType;
    original: string;
}

export type ApiSearchResult = WeatherStationSearchResult | WeatherPlaceSearchResult;

/**
 * Base fields present on all search results.
 */
interface SearchResultBase {
    groupType?: SearchGroupType;
    trackingId?: string;
    queryMeta?: SearchQueryMeta;

    /**
     * Canonical coordinates for map interactions.
     * Uses query coordinates when available, otherwise API location coordinates.
     */
    coordinates: Coordinates;
}

/**
 * API-derived fields. These fields are present only when the item originated
 * from the API and may be absent for synthetic coordinate results with no API data.
 */
interface ApiResultFields {
    id?: string;
    loc?: Location;
    place?: Place;
    profile?: Profile;
    relativeTo?: RelativeTo;
}

export type SearchResult = SearchResultBase & ApiResultFields;

export interface ApiResponse {
    response: ApiSearchResult | ApiSearchResult[];
    request: string;
}

export type SearchGroupType = 'recent' | 'stations' | 'places';

/**
 * Type guard that narrows a SearchResult to one with coordinate metadata.
 */
export const isCoordinateSearchResult = (
    result: SearchResult
): result is SearchResult & { queryMeta: SearchQueryMeta } => (
    result.queryMeta?.type === 'coordinate'
);
