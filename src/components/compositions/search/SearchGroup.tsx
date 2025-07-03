import { ReactNode } from 'react';
import clsx from 'clsx';
import { VStack } from '@/components/primitives/layout/Stack';
import { SearchClearContext } from './SearchClearContext';

export interface SearchGroupProps {
    /** Child elements */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Callback to clear entire group */
    onClear?: () => void;
}

/**
 * Container for a group of search items.
 * Can provide group-level clear functionality through context.
 */
export const SearchGroup = ({
    children,
    onClear,
    className
}: SearchGroupProps) => {
    const Component = (
        <VStack className={clsx('xw-search-group', className)}>
            {children}
        </VStack>
    );

    if (!onClear) {
        return Component;
    }

    return (
        <SearchClearContext.Provider value={{ onClear }}>
            {Component}
        </SearchClearContext.Provider>
    );
};

SearchGroup.displayName = 'Search.Group';
