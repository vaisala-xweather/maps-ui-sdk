import { forwardRef, ReactNode } from 'react';
import clsx from 'clsx';
import { useSearchContext } from './SearchProvider';

export interface SearchFocusAreaProps {
    children: ReactNode;
    className?: string;
}

/**
 * Component that manages focus state for the search component.
 * When focus enters this area, the search results will be shown if there are any.
 * When focus leaves this area, the search results will be hidden.
 */
export const SearchFocusArea = forwardRef<HTMLDivElement, SearchFocusAreaProps>(({
    children,
    className
}, ref) => {
    const { setIsFocused, setActiveDescendantId } = useSearchContext();

    return (
        <div
            ref={ref}
            tabIndex={-1}
            className={clsx('xw-search-focus-area', className)}
            onFocusCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsFocused(true);
                }
            }}
            onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setIsFocused(false);
                    setActiveDescendantId(null);
                }
            }}
        >
            {children}
        </div>
    );
});

SearchFocusArea.displayName = 'Search.FocusArea';
