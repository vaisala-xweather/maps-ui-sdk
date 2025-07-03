import { SearchResult } from '@/types/search';
import { createContext, useContext } from 'react';

export interface SearchItemContextValue {
    item: SearchResult;
    onSelect?: (item: SearchResult) => void;
}

export const SearchItemContext = createContext<SearchItemContextValue | null>(null);

export const useSearchItemContext = () => {
    const context = useContext(SearchItemContext);
    if (!context) {
        throw new Error('useSearchItemContext must be used within a SearchItem');
    }
    return context;
};
