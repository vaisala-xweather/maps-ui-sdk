import { LoadingProvider } from '@/providers/LoadingProvider';
import { ReactNode } from 'react';
import { SearchProvider, type SearchProviderProps } from './SearchProvider';
import { SearchGroup } from './SearchGroup';
import { SearchItem } from './SearchItem';
import { SearchResultsFetcher } from './SearchResultsFetcher';
import { SearchResultsData } from './SearchResultsData';
import { SearchBar } from './SearchBar';
import { SearchInput } from './SearchInput';
import { SearchLoadingSpinner } from './SearchLoadingSpinner';
import { SearchIcon } from './SearchIcon';
import { SearchGeolocateButton } from './SearchGeoLocateButton';
import { SearchClear } from './SearchClear';
import { SearchScrollableArea } from './SearchScrollableArea';
import { SearchGroupTitle } from './SearchGroupTitle';
import { SearchFocusArea } from './SearchFocusArea';
import { SearchItemButton } from './SearchItemButton';
import { SearchDivider } from './SearchDivider';
import { SearchList } from './SearchList';

type SearchRootProps = SearchProviderProps & {
    children: ReactNode;
};

const SearchRoot = ({ children, ...props }: SearchRootProps) => (
    <LoadingProvider>
        <SearchProvider {...props}>
            {children}
        </SearchProvider>
    </LoadingProvider>
);
SearchRoot.displayName = 'Search.Root';

type SearchProps = SearchProviderProps;

const Search = ({ children, ...rest }: SearchProps) => (
    <Search.Root {...rest}>
        {children}
    </Search.Root>
);
Search.displayName = 'Search';

Search.Root = SearchRoot;
Search.Provider = SearchProvider;
Search.ResultsFetcher = SearchResultsFetcher;
Search.ResultsData = SearchResultsData;
Search.Group = SearchGroup;
Search.GroupTitle = SearchGroupTitle;
Search.Item = SearchItem;
Search.Divider = SearchDivider;
Search.Bar = SearchBar;
Search.Input = SearchInput;
Search.LoadingSpinner = SearchLoadingSpinner;
Search.SearchIcon = SearchIcon;
Search.GeolocateButton = SearchGeolocateButton;
Search.Clear = SearchClear;
Search.ScrollableArea = SearchScrollableArea;
Search.FocusArea = SearchFocusArea;
Search.ItemButton = SearchItemButton;
Search.List = SearchList;
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Search, type SearchProps };

// Context
export { SearchContext, useSearchContext } from './SearchProvider';
export type { SearchContextProps } from './SearchProvider';
export { SearchClearContext, useSearchClearContext } from './SearchClearContext';
export type { SearchClearContextValue } from './SearchClearContext';
export { SearchItemContext, useSearchItemContext } from './SearchItemContext';
export type { SearchItemContextValue } from './SearchItemContext';

// Sub-components
export { SearchRoot, type SearchRootProps };
export { SearchProvider, type SearchProviderProps } from './SearchProvider';
export { SearchGroupTitle, type SearchGroupTitleProps } from './SearchGroupTitle';
export { SearchGroup, type SearchGroupProps } from './SearchGroup';
export { SearchItem, type SearchItemProps } from './SearchItem';
export { SearchDivider, type SearchDividerProps } from './SearchDivider';
export { SearchResultsFetcher, type SearchResultsFetcherProps } from './SearchResultsFetcher';
export { SearchResultsData, type SearchResultsDataProps } from './SearchResultsData';
export { SearchBar, type SearchBarProps } from './SearchBar';
export { SearchInput, type SearchInputProps } from './SearchInput';
export { SearchLoadingSpinner, type SearchLoadingSpinnerProps } from './SearchLoadingSpinner';
export { SearchIcon, type SearchIconProps } from './SearchIcon';
export { SearchGeolocateButton, type SearchGeolocateButtonProps } from './SearchGeoLocateButton';
export { SearchClear, type SearchClearProps } from './SearchClear';
export { SearchScrollableArea, type SearchScrollableAreaProps } from './SearchScrollableArea';
export { SearchFocusArea, type SearchFocusAreaProps } from './SearchFocusArea';
export { SearchItemButton, type SearchItemButtonProps } from './SearchItemButton';
export { SearchList, type SearchListProps } from './SearchList';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
