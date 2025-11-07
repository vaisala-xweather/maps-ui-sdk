import { ReactNode } from 'react';
import { SearchResult } from '@/types/search';
import { useSearchContext } from './SearchProvider';

export interface SearchResultsDataProps {
    children: (props: {
        places: SearchResult[];
        stations: SearchResult[];
        /** @deprecated Use recentSelections */
        visitedLocations: SearchResult[];
        recentSelections: SearchResult[];
        hasResults: boolean;
    }) => ReactNode;
}

export const SearchResultsData = ({ children }: SearchResultsDataProps) => {
    const { currentResults, visitedLocations, recentSelections } = useSearchContext();

    const places = currentResults.filter((item) => item.groupType === 'places');
    const stations = currentResults.filter((item) => item.groupType === 'stations');
    const hasResults = currentResults.length > 0;

    return children({
        places,
        stations,
        visitedLocations,
        recentSelections,
        hasResults
    });
};

SearchResultsData.displayName = 'Search.ResultsData';
