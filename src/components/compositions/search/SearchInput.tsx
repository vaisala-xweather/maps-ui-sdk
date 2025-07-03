import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { useComboBoxKeyboard } from '@/hooks/useComboBoxKeyboard';
import { useSearchContext } from './SearchProvider';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    placeholder?: string;
}

export const SearchInput = ({
    className,
    placeholder = 'Search locations',
    name = 'search',
    ...rest
}: SearchInputProps) => {
    const {
        query,
        currentResults,
        visitedLocations,
        activeDescendantId,
        setActiveDescendantId,
        onSelectResult,
        onChange,
        onFocus,
        inputRef,
        isExpanded
    } = useSearchContext();
    const { handleKeyDown } = useComboBoxKeyboard({
        items: [...currentResults, ...visitedLocations],
        activeDescendantId,
        setActiveDescendantId,
        onSelectResult
    });

    const activeDescendant = activeDescendantId
        ? `search-item-${activeDescendantId}`
        : undefined;

    return (
        <input
            ref={inputRef}
            className={clsx('xw-search-input xw-w-full xw-min-w-0 xw-truncate', className)}
            role="combobox"
            aria-expanded={isExpanded}
            aria-controls="search-results-list"
            aria-activedescendant={activeDescendant}
            aria-autocomplete="list"
            autoComplete="off"
            type="text"
            name={name}
            tabIndex={0}
            value={query}
            placeholder={placeholder}
            onChange={onChange}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            {...rest}
        />
    );
};

SearchInput.displayName = 'Search.Input';
