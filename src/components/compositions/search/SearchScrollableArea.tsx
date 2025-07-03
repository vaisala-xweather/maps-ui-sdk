import { clsx } from 'clsx';
import { ScrollableArea, type ScrollableAreaProps } from '@/components/primitives/layout/ScrollableArea';

export type SearchScrollableAreaProps = ScrollableAreaProps;

export const SearchScrollableArea = ({
    children,
    className
}: SearchScrollableAreaProps) => (
    <ScrollableArea className={clsx('xw-search-scrollable-area', className)}>
        {children}
    </ScrollableArea>
);

SearchScrollableArea.displayName = 'Search.ScrollableArea';
