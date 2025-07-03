import {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    useCallback,
    ChangeEvent,
    RefObject,
    ChangeEventHandler,
    ReactNode,
    useMemo
} from 'react';
import { debounce } from '@/utils/debounce';
import { prepareRequest, formatResult } from '@/utils/search';
import { UseWeatherApiRequest } from '@/mapsgl/useWeatherApi';
import { SearchResult, SearchGroupType } from '@/types/search';

export interface SearchContextProps {
    // Query
    query: string;
    setQuery: (query: string) => void;
    // Requests, visited
    requests: UseWeatherApiRequest[];
    visitedLocations: SearchResult[];
    // Focus
    inputRef: RefObject<HTMLInputElement> | null;
    isFocused: boolean;
    setIsFocused: (focused: boolean) => void;
    focusInput: () => void;
    // Active descendant ID for ARIA
    activeDescendantId: string | null;
    setActiveDescendantId: (id: string | null) => void;
    // Search groups and results
    searchGroups: SearchGroupType[];
    currentResults: SearchResult[];
    setCurrentResults: (results: SearchResult[]) => void;
    // Recent/results list expanded state
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    // Optional formatting
    resultFormatter?: (result: SearchResult) => string;
    // Event handlers
    onChange: ChangeEventHandler<HTMLInputElement>;
    onFocus: () => void;
    onSelectResult: (result: SearchResult) => void;
    // Visited-locations management
    clearVisitedLocations: () => void;
    removeVisitedLocation: (identifier: { item: SearchResult; label?: string }) => void;

}

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};

export interface SearchProviderProps {
    children: ReactNode;
    maxVisitedLocations?: number;
    inputRef?: RefObject<HTMLInputElement>;
    searchGroups?: SearchGroupType[];
    resultFormatter?: (result: SearchResult) => string;
    onSelectResult?: (result: SearchResult) => void;
}

export const SearchProvider = ({
    children,
    onSelectResult,
    resultFormatter = formatResult,
    maxVisitedLocations = 3,
    inputRef: externalInputRef,
    searchGroups = ['recent', 'places', 'stations']
}: SearchProviderProps) => {
    // Query, requests and recent/results state
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
    const [currentResults, setCurrentResults] = useState<SearchResult[]>([]);
    const [requests, setRequests] = useState<UseWeatherApiRequest[]>([]);
    const [visitedLocations, setVisitedLocations] = useState<SearchResult[]>([]);
    // UI state
    const [isFocused, setIsFocused] = useState(false);
    const [activeDescendantId, setActiveDescendantId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    // Input ref management
    const internalInputRef = useRef<HTMLInputElement>(null);
    const inputRef = externalInputRef || internalInputRef;

    const debouncedSearch = useMemo(
        () => debounce((queryString: string) => {
            setRequests(prepareRequest(queryString, searchGroups));
        }, 250),
        [searchGroups]
    );

    useEffect(() => {
        if (query.trim()) {
            if (!selectedItem) {
                debouncedSearch(query);
            }
        } else {
            setRequests([]);
            setCurrentResults([]);
        }
    }, [query, selectedItem, debouncedSearch]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setQuery(newValue);
        if (selectedItem) {
            setSelectedItem(null);
        }
    }, [selectedItem]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const focusInput = useCallback(() => {
        setIsFocused(true);
        inputRef.current?.focus();
    }, [inputRef]);

    const handleResultClick = useCallback(
        (result: SearchResult) => {
            setActiveDescendantId(null);
            setRequests([]);
            setCurrentResults([]);
            setSelectedItem(result);

            if (resultFormatter) {
                setQuery(resultFormatter?.(result));
            }

            setVisitedLocations((prev) => {
                const formattedResult = resultFormatter?.(result) ?? result;
                const filtered = prev.filter((location) => {
                    const formattedLocation = resultFormatter?.(location) ?? location;
                    return formattedLocation !== formattedResult;
                });
                return [result, ...filtered].slice(0, maxVisitedLocations);
            });

            onSelectResult?.(result);
        },
        [onSelectResult, resultFormatter, maxVisitedLocations]
    );

    const clearVisitedLocations = useCallback(() => {
        setVisitedLocations([]);
        focusInput();
    }, [focusInput]);

    const removeVisitedLocation = useCallback(
        ({ item, label }: { item: SearchResult; label?: string }) => {
            setVisitedLocations((prev) => {
                const itemLabel = label ?? resultFormatter?.(item);
                const filtered = prev.filter((loc) => {
                    const locLabel = resultFormatter?.(loc);
                    return locLabel !== itemLabel;
                });
                if (filtered.length === 0) focusInput();
                return filtered;
            });
        },
        [focusInput, resultFormatter]
    );

    return (
        <SearchContext.Provider
            value={{
                // Query management
                query,
                setQuery,
                // Input focus and accessibility
                inputRef,
                isFocused,
                setIsFocused,
                focusInput,
                // Active descendant tracking for ARIA
                activeDescendantId,
                setActiveDescendantId,
                // Search requests and visited locations
                requests,
                visitedLocations,
                // Search results
                searchGroups,
                currentResults,
                setCurrentResults,
                // Recent/results list expanded state
                isExpanded,
                setIsExpanded,
                // Optional result formatting
                resultFormatter,
                // Event handlers
                onChange: handleChange,
                onFocus: handleFocus,
                onSelectResult: handleResultClick,
                // Visited locations management
                clearVisitedLocations,
                removeVisitedLocation
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

SearchProvider.displayName = 'Search.Provider';
