import { MouseEvent, ReactNode, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { SearchResult } from '@/types/search';
import { HStack } from '@/components/primitives/layout/Stack';
import { dataAttribute } from '@/utils/dom';
import { Button } from '@/components/primitives/buttons/Button';
import { useSearchContext } from './SearchProvider';
import { SearchItemContext } from './SearchItemContext';
import { SearchClearContext } from './SearchClearContext';

export interface SearchItemProps {
    item: SearchResult;
    children?: ReactNode;
    className?: string;
    onClear?: (item: SearchResult) => void;
}

/**
 * Container for a search item that provides item data and clear functionality to its children.
 * Used for both search results and recent items.
 */
export const SearchItem = ({
    item,
    onClear,
    children,
    className
}: SearchItemProps) => {
    const { activeDescendantId, query, resultFormatter, setActiveDescendantId } = useSearchContext();
    const isActive = activeDescendantId === item.trackingId;
    const isSelected = Boolean(query && resultFormatter?.(item) === query);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeDescendantId === item.trackingId && containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }, [activeDescendantId, item.trackingId, containerRef]);

    const handleMouseEnter = () => {
        if (item.trackingId && activeDescendantId !== item.trackingId) {
            setActiveDescendantId(item.trackingId);
        }
    };

    const handleMouseLeave = () => {
        if (item.trackingId && activeDescendantId === item.trackingId) {
            setActiveDescendantId(null);
        }
    };

    const Component = (
        <SearchItemContext.Provider value={{ item }}>
            <HStack
                ref={containerRef}
                className={clsx('xw-search-item xw-items-center', className)}
                role="option"
                id={`search-item-${item.trackingId}`}
                aria-selected={isSelected}
                data-active={dataAttribute(isActive)}
                data-focused={dataAttribute(isActive)}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </HStack>
        </SearchItemContext.Provider>
    );

    if (!onClear) {
        return Component;
    }

    return (
        <SearchClearContext.Provider
            value={{
                onClear: () => onClear(item),
                isVisible: true
            }}>
            {Component}
        </SearchClearContext.Provider>
    );
};

SearchItem.displayName = 'Search.Item';
