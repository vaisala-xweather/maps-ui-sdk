import { ReactNode, useEffect, useMemo } from 'react';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { useDataContext } from '@/providers/DataProvider';
import { useLoadingContext } from '@/providers/LoadingProvider';
import { isArray } from '@aerisweather/javascript-utils';
import { nanoid } from 'nanoid';
import { ApiResponse, ApiSearchResult, SearchGroupType, SearchResult, SearchQueryMeta } from '@/types/search';
import { Coordinates } from '@/types/location';
import { parseCoordinates } from '@/utils/location';
import { locationToCoordinates } from '@/utils/search';
import { useSearchContext } from './SearchProvider';

const areValidSearchResults = (value: unknown): value is ApiSearchResult[] => (
    Array.isArray(value)
    && value.every((item) => 'loc' in item && (('id' in item) || ('place' in item && 'profile' in item))));

const createSyntheticCoordinateResult = (coordinates: Coordinates, queryMeta: SearchQueryMeta): SearchResult => ({
    trackingId: `coord:${coordinates.lat},${coordinates.lon}`,
    groupType: 'places',
    queryMeta,
    coordinates
});

const useProcessedResults = (
    apiResponse: ApiResponse[] | null,
    searchGroups: SearchGroupType[],
    queryMeta: SearchQueryMeta | undefined
) => useMemo(() => {
    if (!apiResponse) return [];

    try {
        const groupedResults: Record<SearchGroupType, SearchResult[]> = {
            stations: [],
            places: [],
            recent: []
        };
        const queryCoordinates = queryMeta?.type === 'coordinate'
            ? parseCoordinates(queryMeta.original)
            : null;

        apiResponse.forEach((requestResponse) => {
            const responseData = isArray(requestResponse?.response)
                ? requestResponse.response
                : [requestResponse?.response];
            const isObservation = requestResponse.request?.includes('/observations/');

            if (!areValidSearchResults(responseData)) {
                console.error('Invalid response data format');
                return;
            }

            responseData.forEach((data) => {
                const trackingId = 'id' in data ? data.id : nanoid();
                const groupType = isObservation ? 'stations' : 'places';
                const coordinates = queryCoordinates ?? locationToCoordinates(data.loc);

                groupedResults[groupType].push({
                    ...data,
                    trackingId,
                    groupType,
                    queryMeta,
                    coordinates
                });
            });
        });

        if (
            queryMeta?.type === 'coordinate'
            && queryCoordinates
            && groupedResults.places.length === 0
        ) {
            groupedResults.places.push(
                createSyntheticCoordinateResult(queryCoordinates, queryMeta)
            );
        }

        return searchGroups.flatMap((group) => groupedResults[group] || []);
    } catch (error) {
        console.error('Error processing weather data:', error);
        return [];
    }
}, [apiResponse, searchGroups, queryMeta]);

const ResultsProcessor = ({ children }: { children: ReactNode }) => {
    const { data, loading } = useDataContext() ?? { loading: false };
    const { setLoading } = useLoadingContext();
    const { setCurrentResults, searchGroups, queryMeta } = useSearchContext();
    const processedResults = useProcessedResults(data, searchGroups, queryMeta);

    useEffect(() => {
        setLoading(loading, 0);
    }, [loading, setLoading]);

    useEffect(() => {
        setCurrentResults(processedResults);
    }, [processedResults, setCurrentResults]);

    return <>{children}</>;
};

export interface SearchResultsFetcherProps {
    children: ReactNode;
}

export const SearchResultsFetcher = ({ children }: SearchResultsFetcherProps) => {
    const { requests, query } = useSearchContext();
    const { setLoading } = useLoadingContext();

    useEffect(() => {
        if (!query) {
            setLoading(false, 0);
        }
    }, [query, setLoading]);

    if (!query || !requests || requests.length === 0) {
        return children;
    }

    return (
        <WeatherApiDataFetcher requests={requests}>
            <ResultsProcessor>
                {children}
            </ResultsProcessor>
        </WeatherApiDataFetcher>
    );
};

SearchResultsFetcher.displayName = 'Search.ResultsFetcher';
