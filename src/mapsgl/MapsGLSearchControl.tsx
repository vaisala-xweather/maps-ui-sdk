import { Fragment } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, type SearchProps } from '@/components/compositions/search/index';
import { SearchResult, SearchGroupType } from '@/types/search';
import { Fade } from '@/components/primitives/animation/Fade';
import { formatResult } from '@/utils/search';
import { useSearchContext } from '@/components/compositions/search/SearchProvider';
import { SearchGroupTitle } from '@/components/compositions/search/SearchGroupTitle';
import { THEME } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { HStack } from '@/components/primitives/layout/Stack';

export interface SearchGroupConfig {
    type: SearchGroupType;
    title: string;
    items: SearchResult[];
}

export type MapsGLSearchControlProps = Omit<SearchProps, 'children'> & {
    className?: string;
    searchGroups?: SearchGroupType[];
    placeholder?: string;
    onGeoLocationError?: (error: GeolocationPositionError) => void;
};

const RecentResults = () => {
    const { visitedLocations, clearVisitedLocations, removeVisitedLocation, activeDescendantId } = useSearchContext();

    if (visitedLocations.length === 0) return null;

    return (
        <Search.List>
            <Search.ScrollableArea
                className="xw-py-2.5 xw-mt-2 xw-rounded-xl xw-shadow-lg xw-bg-white xw-max-h-[540px]"
            >
                <Search.Group className="xw-py-4" onClear={clearVisitedLocations}
                >
                    <div className="xw-px-4">
                        <Search.Divider className="xw-border-t-2 xw-border-slate-900" />
                        <HStack className="xw-items-center xw-mb-2">
                            <SearchGroupTitle>Recent</SearchGroupTitle>
                            <Search.Clear className="xw-ml-auto" />
                        </HStack>
                    </div>
                    <AnimatePresence initial={false}>
                        {visitedLocations.map((item, index) => (
                            <motion.div
                                key={item.trackingId ?? index}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                    height: { duration: 0.2 },
                                    opacity: { duration: 0.1 }
                                }}
                                style={{ overflow: 'hidden' }}
                            >
                                {index > 0 && (
                                    <Search.Divider className="xw-mx-4 xw-border-t-0.5 xw-border-slate-100"
                                    />
                                )}
                                <Search.Item
                                    item={item}
                                    className="data-[active]:xw-bg-secondary-50 group"
                                    onClear={() => removeVisitedLocation({ item })}
                                >
                                    <Search.ItemButton className="xw-text-[13px] xw-pl-4 xw-py-2" />
                                    <Search.Clear
                                        className={
                                            `xw-w-5 xw-h-5 xw-rounded-full xw-mx-4 ${activeDescendantId === item.trackingId
                                                ? 'xw-text-white xw-bg-secondary-400'
                                                : 'xw-text-slate-500 xw-bg-slate-100'}`
                                        }
                                        iconProps={{ size: 8 }}
                                    />
                                </Search.Item>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Search.Group>
            </Search.ScrollableArea>
        </Search.List>
    );
};

const SearchResults = () => {
    const { searchGroups, currentResults } = useSearchContext();
    const resultsGroups = searchGroups.filter((type) => type !== 'recent');

    return (
        <Search.List>
            <Search.ScrollableArea
                className="xw-py-2.5 xw-mt-2 xw-rounded-xl xw-shadow-lg xw-bg-white xw-max-h-[540px]">
                {resultsGroups
                    .map((type) => {
                        const items = currentResults?.filter((result) => result.groupType === type);
                        if (items.length === 0) return null;

                        return (
                            <Search.Group key={type} className="xw-py-4">
                                <div className="xw-px-4 xw-mb-2">
                                    <Search.Divider className="xw-border-t-2 xw-border-slate-900" />
                                    <SearchGroupTitle>
                                        {type === 'places' ? 'Places' : 'Stations'}
                                    </SearchGroupTitle>
                                </div>
                                {items.map((item, index) => (
                                    <Fragment key={index}>
                                        {index > 0 && (
                                            <Search.Divider className="xw-mx-4 xw-border-t-0.5 xw-border-slate-100"/>
                                        )}
                                        <Search.Item item={item} className="data-[active]:xw-bg-secondary-50">
                                            <Search.ItemButton className="xw-text-[13px] xw-px-4 xw-py-2" />
                                        </Search.Item>
                                    </Fragment>
                                ))}
                            </Search.Group>
                        );
                    })}
            </Search.ScrollableArea>
        </Search.List>
    );
};

const SearchContent = () => {
    const { query, visitedLocations, isFocused } = useSearchContext();
    const { breakpoint } = useResponsive();
    const isMobile = breakpoint === 'base';

    return (
        <Search.ResultsFetcher>
            <Search.ResultsData>
                {({ hasResults }) => {
                    const shouldShowRecent = Boolean((isFocused) && !query && visitedLocations.length > 0);
                    const shouldShowResults = Boolean((isMobile || isFocused) && query && hasResults);

                    return (
                        <AnimatePresence mode="wait">
                            {shouldShowRecent && (
                                <Fade key="recent">
                                    <RecentResults />
                                </Fade>
                            )}
                            {shouldShowResults && (
                                <Fade key="search">
                                    <SearchResults />
                                </Fade>
                            )}
                        </AnimatePresence>
                    );
                }}
            </Search.ResultsData>
        </Search.ResultsFetcher>
    );
};

export const MapsGLSearchControl = ({
    resultFormatter,
    onSelectResult,
    className = '',
    placeholder = 'Search locations',
    inputRef,
    searchGroups = ['recent', 'places', 'stations'],
    onGeoLocationError
}: MapsGLSearchControlProps) => (
    <Search
        inputRef={inputRef}
        onSelectResult={onSelectResult}
        resultFormatter={resultFormatter}
        searchGroups={searchGroups}>
        <Search.FocusArea className={className}>
            <Search.Bar className="xw-gap-2 xw-border-2 xw-border-transparent xw-bg-white xw-rounded-xl
                xw-h-11 xw-pl-3 xw-pr-2 xw-py-2 xw-focus-within:xw-border-2 xw-focus-within:xw-border-secondary-200">
                <Search.SearchIcon className="xw-text-slate-500" />
                <Search.Input className="xw-outline-none xw-text-black" placeholder={placeholder} />
                <Search.LoadingSpinner />
                <Search.Clear
                    className="xw-w-5 xw-h-5 xw-rounded-full xw-bg-slate-200"
                    iconProps={{
                        size: 8,
                        color: THEME.colors['slate-500']
                    }}
                />
                <Search.GeolocateButton
                    onGeoLocationError={onGeoLocationError}
                    className="xw-min-w-7 xw-min-h-7 xw-rounded-full xw-bg-slate-900"
                />
            </Search.Bar>
            <SearchContent />
        </Search.FocusArea>
    </Search>
);
