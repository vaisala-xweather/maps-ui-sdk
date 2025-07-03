import { createContext, useContext } from 'react';

/**
 * Context for managing clear functionality within search components
 */
export interface SearchClearContextValue {
    /** Whether the clear button is visible */
    isVisible?: boolean;
    /** Function to handle clearing */
    onClear: () => void;
}

export const SearchClearContext = createContext<SearchClearContextValue>({
    isVisible: true,
    onClear: () => {}
});
/**
 * Hook to access clear functionality context
 * @throws Error if used outside of a clear context provider
 */
export function useSearchClearContext() {
    const context = useContext(SearchClearContext);
    if (!context) {
        throw new Error('SearchClear must be used within a clear context provider');
    }
    return context;
}
