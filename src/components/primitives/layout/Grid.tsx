import {
    ReactNode,
    CSSProperties,
    isValidElement,
    cloneElement,
    Children,
    ReactElement
} from 'react';
import clsx from 'clsx';
import { pixels } from '@/utils/css';

export interface GridProps {
    /** The grid items to be rendered */
    children: ReactNode;
    /** Number of items to display per row */
    itemsPerRow?: number;
    /** Gap size in pixels between grid items */
    gap?: number;
    /** If true, the first item spans the full width of the row */
    firstItemFullWidth?: boolean;
    /** If true, the last item grows to fill remaining space or spans the full row if alone */
    growLastItem?: boolean;
    /** Additional classes for the grid container */
    className?: string;
}

/**
 * A flexible grid component that arranges its children in a grid or flex layout,
 * with options to modify the behavior of the first and last items.
 *
 * @param props - The props for the Grid component.
 * @returns The rendered Grid component.
 */
export const Grid = ({
    children,
    itemsPerRow,
    gap = 4,
    firstItemFullWidth = false,
    growLastItem = false,
    className = 'xw-w-full'
}: GridProps): JSX.Element => {
    const childrenArray = Children.toArray(children).filter(Boolean);
    const totalItems = childrenArray.length;
    const useFlexLayout = firstItemFullWidth || growLastItem;
    const effectiveItemsPerRow = itemsPerRow ?? totalItems;

    // Calculate row information
    const totalRows = Math.ceil(totalItems / effectiveItemsPerRow);
    const lastRowIndex = totalRows - 1;
    const itemsInLastRow = totalItems % effectiveItemsPerRow || effectiveItemsPerRow;

    // Styles for the grid container
    const containerStyle: CSSProperties = {
        gap: `${gap}px`,
        display: useFlexLayout ? 'flex' : 'grid',
        ...(useFlexLayout
            ? {
                flexWrap: 'wrap'
            }
            : {
                gridTemplateColumns: `repeat(${effectiveItemsPerRow}, minmax(0, 1fr))`
            })
    };

    return (
        <div className={clsx(className)} style={containerStyle}>
            {Children.map(childrenArray, (child, index) => {
                if (!isValidElement(child)) return child;

                const element = child as ReactElement<any>;
                const isFirst = index === 0;
                const isLast = index === totalItems - 1;
                const currentRow = Math.floor(index / effectiveItemsPerRow);
                const isInLastRow = currentRow === lastRowIndex;
                const gapWidthInPixels = (gap * (effectiveItemsPerRow - 1)) / effectiveItemsPerRow;

                const itemWidth = `calc(${100 / effectiveItemsPerRow}% - ${pixels(gapWidthInPixels)}`;

                const itemStyle: CSSProperties = {
                    flexGrow: 0,
                    flexShrink: 0
                };

                if (useFlexLayout) {
                    if (firstItemFullWidth && isFirst) {
                        // First item spans the full width of the row
                        itemStyle.flexBasis = '100%';
                    } else if (growLastItem && isLast && isInLastRow) {
                        // Last item behavior
                        if (itemsInLastRow === 1) {
                            // Last item alone in its row spans full width
                            itemStyle.flexBasis = '100%';
                            itemStyle.flexGrow = 0;
                        } else {
                            // Last item grows to fill remaining space
                            itemStyle.flexBasis = 'auto';
                            itemStyle.flexGrow = 1;
                        }
                    } else {
                        // Regular items
                        itemStyle.flexBasis = itemWidth;
                    }
                }

                // Merge existing styles with calculated styles
                const combinedStyle: CSSProperties = {
                    ...child.props.style,
                    ...itemStyle
                };

                // Clone the child element with new styles if necessary
                return Object.keys(itemStyle).length > 0
                    ? cloneElement(element, { style: combinedStyle })
                    : child;
            })}
        </div>
    );
};
