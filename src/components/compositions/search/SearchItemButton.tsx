import { ReactNode, MouseEvent, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/primitives/buttons/Button';
import { dataAttribute } from '@/utils/dom';
import { useSearchItemContext } from './SearchItemContext';
import { useSearchContext } from './SearchProvider';

export interface SearchItemButtonProps {
    /** Additional CSS classes */
  className?: string;
      /** Optional content override */
  children?: ReactNode;
}

/**
 * Button that displays and handles selection of a search item.
 * Must be used within a SearchItem component.
 * Can receive children to override the default formatted content.
 *
 * @accessibility When providing custom children, ensure the displayed text matches
 * what would be returned by the resultFormatter for proper aria-selected behavior.
 * Example:
 * ```tsx
 * <SearchItemButton>
 *   <CustomIcon />
 *   {resultFormatter(item)} // Include this exact text somewhere in your custom content
 * </SearchItemButton>
 * ```
 */
export const SearchItemButton = ({ className, children }: SearchItemButtonProps) => {
    const { item } = useSearchItemContext();
    const { onSelectResult, resultFormatter, activeDescendantId } = useSearchContext();
    const isActive = activeDescendantId === item.trackingId;

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        onSelectResult(item);
    };

    return (
        <Button
            id={`search-item-button-${item.trackingId}`}
            tabIndex={-1}
            className={clsx('xw-w-full xw-text-left', className)}
            data-active={dataAttribute(isActive)}
            data-focused={dataAttribute(isActive)}
            onClick={handleClick}
        >
            {children ?? resultFormatter?.(item)}
        </Button>
    );
};

SearchItemButton.displayName = 'Search.ItemButton';
