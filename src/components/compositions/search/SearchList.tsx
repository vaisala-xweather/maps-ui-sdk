import { forwardRef, ReactNode, useEffect } from 'react';
import clsx from 'clsx';
import { useSearchContext } from './SearchProvider';

/**
 * Accessible container for the visible recent/result list.
 * It sets isExpanded to true on mount and false on unmount.
 */
export interface SearchListProps {
    className?: string
    children: ReactNode;
}

export const SearchList = forwardRef<HTMLDivElement, SearchListProps>(
    ({ className, children }, ref) => {
        const { setIsExpanded } = useSearchContext();

        useEffect(() => {
            setIsExpanded(true);
            return () => setIsExpanded(false);
        }, [setIsExpanded]);

        return (
            <div
                ref={ref}
                id="search-results-list"
                role="listbox"
                aria-label="Search results"
                tabIndex={-1}
                className={clsx('xw-search-list', className)}
            >
                {children}
            </div>
        );
    }
);

SearchList.displayName = 'Search.List';
