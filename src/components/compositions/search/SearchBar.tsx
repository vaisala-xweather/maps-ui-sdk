import { ReactNode } from 'react';
import clsx from 'clsx';
import { HStack } from '@/components/primitives/layout/Stack';
import { SearchClearContext } from './SearchClearContext';
import { useSearchContext } from './SearchProvider';

export interface SearchBarProps {
    /** Child elements */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Container for search input and related controls.
 * Provides clear functionality for the search query.
 */
export const SearchBar = ({ children, className }: SearchBarProps) => {
    const { query, setQuery, focusInput } = useSearchContext();

    return (
        <SearchClearContext.Provider
            value={{
                isVisible: !!query,
                onClear: () => {
                    setQuery('');
                    focusInput();
                }
            }}>
            <HStack className={clsx('xw-search-bar xw-items-center', className)}>
                {children}
            </HStack>
        </SearchClearContext.Provider>
    );
};

SearchBar.displayName = 'Search.Bar';
