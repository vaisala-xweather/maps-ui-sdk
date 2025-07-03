import { forwardRef } from 'react';
import { IconButton } from '@/components/primitives/buttons/IconButton';
import { ClearIcon } from '@/components/compositions/icons/Icon';
import clsx from 'clsx';
import { IconButtonWithDefaultsProps } from '@/types/button';
import { useSearchClearContext } from './SearchClearContext';

export interface SearchClearProps extends IconButtonWithDefaultsProps {
    /** Optional clear callback - overrides context */
    onClear?: () => void;
}

/**
 * Clear button that uses the nearest SearchClearContext.
 * Will not render if no clear callback is available through context/props or if isVisible is false.
 */
export const SearchClear = forwardRef<HTMLButtonElement, SearchClearProps>(({
    id = 'search-clear',
    icon = ClearIcon,
    iconProps,
    onClick,
    onClear,
    className,
    ...rest
}, ref) => {
    const { isVisible, onClear: contextClear } = useSearchClearContext();
    const handleClear = onClear ?? contextClear;

    if (!isVisible || !handleClear) return null;

    return (
        <IconButton
            ref={ref}
            id={id}
            icon={icon}
            iconProps={iconProps}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
                e.stopPropagation();
                handleClear();
                onClick?.(e);
            }}
            className={clsx('xw-search-clear', className)}
            {...rest}
        />
    );
});

SearchClear.displayName = 'Search.Clear';
