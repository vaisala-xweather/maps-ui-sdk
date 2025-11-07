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
import { prepareRequest, formatResult, getSearchQueryMeta } from '@/utils/search';
import { UseWeatherApiRequest } from '@/mapsgl/useWeatherApi';
import { SearchResult, SearchGroupType, SearchQueryMeta } from '@/types/search';

export interface SearchContextProps {
    // Query
    query: string;
    setQuery: (query: string) => void;
    // Requests, visited
    requests: UseWeatherApiRequest[];
    /** @deprecated Use recentSelections instead. */
    visitedLocations: SearchResult[];
    recentSelections: SearchResult[];
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
    queryMeta: SearchQueryMeta | undefined;
    coordinatePrecision: number;
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
    /** @deprecated Use clearRecentSelections instead. */
    clearVisitedLocations: () => void;
    clearRecentSelections: () => void;
    /** @deprecated Use removeRecentSelection instead. */
    removeVisitedLocation: (identifier: { item: SearchResult; label?: string }) => void;
    removeRecentSelection: (identifier: { item: SearchResult; label?: string }) => void;

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
    maxRecentSelections?: number;
    /** @deprecated Use maxRecentSelections instead. */
    maxVisitedLocations?: number;
    inputRef?: RefObject<HTMLInputElement>;
    searchGroups?: SearchGroupType[];
    resultFormatter?: (result: SearchResult) => string;
    onSelectResult?: (result: SearchResult) => void;
    coordinatePrecision?: number;
    // Controlled/uncontrolled query
    query?: string;
    onQueryChange?: (query: string) => void;
    // Recent selections (controlled)
    recentSelections?: SearchResult[];
    onRecentSelectionsChange?: (items: SearchResult[]) => void;
    /** @deprecated Use recentSelections instead. */
    visitedLocations?: SearchResult[];
    /** @deprecated Use onRecentSelectionsChange instead. */
    onVisitedLocationsChange?: (items: SearchResult[]) => void;
    onFocus?: () => void;
}

export const SearchProvider = ({
    children,
    onSelectResult,
    resultFormatter = formatResult,
    maxRecentSelections,
    maxVisitedLocations,
    inputRef: externalInputRef,
    searchGroups = ['recent', 'places', 'stations'],
    coordinatePrecision = 6,
    query: controlledQuery,
    onQueryChange,
    recentSelections,
    onRecentSelectionsChange,
    visitedLocations: visitedLocationsLegacy,
    onVisitedLocationsChange,
    onFocus: propsOnFocus
}: SearchProviderProps) => {
    // Query, requests and recent/results state
    const [uncontrolledQuery, setUncontrolledQuery] = useState('');
    const query = controlledQuery ?? uncontrolledQuery;
    const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
    const [currentResults, setCurrentResults] = useState<SearchResult[]>([]);
    const [requests, setRequests] = useState<UseWeatherApiRequest[]>([]);
    const [uncontrolledRecentSelections, setUncontrolledRecentSelections] = useState<SearchResult[]>([]);
    const controlledRecentsProp = recentSelections ?? visitedLocationsLegacy;
    const isRecentsControlled = controlledRecentsProp !== undefined;
    const resolvedRecentSelections = controlledRecentsProp ?? uncontrolledRecentSelections;
    const effectiveOnRecentsChange = onRecentSelectionsChange ?? onVisitedLocationsChange;
    const effectiveMaxRecents = maxRecentSelections ?? maxVisitedLocations ?? 3;
    // UI state
    const [isFocused, setIsFocused] = useState(false);
    const [activeDescendantId, setActiveDescendantId] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    // Input ref management
    const internalInputRef = useRef<HTMLInputElement>(null);
    const inputRef = externalInputRef || internalInputRef;

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') return;

        if (maxVisitedLocations !== undefined) {
            console.warn('maxVisitedLocations is deprecated. Use maxRecentSelections instead.');
        }
        if (visitedLocationsLegacy !== undefined) {
            console.warn('visitedLocations is deprecated. Use recentSelections instead.');
        }
        if (onVisitedLocationsChange) {
            console.warn('onVisitedLocationsChange is deprecated. Use onRecentSelectionsChange instead.');
        }
    }, [maxVisitedLocations, visitedLocationsLegacy, onVisitedLocationsChange]);

    const queryMeta = useMemo<SearchQueryMeta | undefined>(() => getSearchQueryMeta(query), [query]);

    const wrappedFormatter = useCallback((result: SearchResult) => {
        if (resultFormatter === formatResult) {
            return formatResult(result, coordinatePrecision);
        }
        return resultFormatter(result);
    }, [resultFormatter, coordinatePrecision]);

    const setQuery = useCallback((next: string) => {
        onQueryChange?.(next);
        if (controlledQuery === undefined) {
            setUncontrolledQuery(next);
        }
    }, [controlledQuery, onQueryChange]);

    const updateRecentSelections = useCallback((compute: (prev: SearchResult[]) => SearchResult[]) => {
        if (isRecentsControlled) {
            const previous = controlledRecentsProp ?? [];
            const next = compute(previous);
            effectiveOnRecentsChange?.(next);
        } else {
            setUncontrolledRecentSelections((prev) => {
                const next = compute(prev);
                effectiveOnRecentsChange?.(next);
                return next;
            });
        }
    }, [isRecentsControlled, controlledRecentsProp, effectiveOnRecentsChange]);

    const debouncedSearch = useMemo(
        () => debounce((queryString: string) => {
            setRequests(prepareRequest(queryString, searchGroups));
        }, 250),
        [searchGroups]
    );

    useEffect(() => {
        const trimmedQuery = query.trim();
        if (trimmedQuery) {
            if (!selectedItem) {
                debouncedSearch(trimmedQuery);
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
    }, [setQuery, selectedItem]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        propsOnFocus?.();
    }, [propsOnFocus]);

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

            setQuery(wrappedFormatter(result));

            updateRecentSelections((prev) => {
                const formattedResult = wrappedFormatter(result);
                const filtered = prev.filter((location) => {
                    const formattedLocation = wrappedFormatter(location);
                    return formattedLocation !== formattedResult;
                });
                return [result, ...filtered].slice(0, effectiveMaxRecents);
            });

            onSelectResult?.(result);
        },
        [onSelectResult, wrappedFormatter, effectiveMaxRecents, setQuery, updateRecentSelections]
    );

    const clearRecentSelections = useCallback(() => {
        updateRecentSelections(() => []);
        focusInput();
    }, [focusInput, updateRecentSelections]);

    const removeRecentSelection = useCallback(
        ({ item, label }: { item: SearchResult; label?: string }) => {
            updateRecentSelections((prev) => {
                const itemLabel = label ?? wrappedFormatter(item);
                const filtered = prev.filter((loc) => {
                    const locLabel = wrappedFormatter(loc);
                    return locLabel !== itemLabel;
                });
                if (filtered.length === 0) focusInput();
                return filtered;
            });
        },
        [focusInput, wrappedFormatter, updateRecentSelections]
    );

    const clearVisitedLocations = clearRecentSelections;
    const removeVisitedLocation = removeRecentSelection;

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
                visitedLocations: resolvedRecentSelections,
                recentSelections: resolvedRecentSelections,
                // Search results
                searchGroups,
                currentResults,
                setCurrentResults,
                queryMeta,
                coordinatePrecision,
                // Recent/results list expanded state
                isExpanded,
                setIsExpanded,
                // Optional result formatting
                resultFormatter: wrappedFormatter,
                // Event handlers
                onChange: handleChange,
                onFocus: handleFocus,
                onSelectResult: handleResultClick,
                // Visited locations management
                clearVisitedLocations,
                clearRecentSelections,
                removeVisitedLocation,
                removeRecentSelection
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

SearchProvider.displayName = 'Search.Provider';
