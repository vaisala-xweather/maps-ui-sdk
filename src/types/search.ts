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

export type SearchResult = (WeatherStationSearchResult | WeatherPlaceSearchResult) & {
    groupType?: SearchGroupType;
    trackingId?: string;
};

export interface ApiResponse {
    response: SearchResult | SearchResult[];
    request: string;
}

export type SearchGroupType = 'recent' | 'stations' | 'places';
