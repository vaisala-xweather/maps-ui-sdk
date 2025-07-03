import { useRef, useEffect, useMemo, ComponentType, useCallback, RefObject } from 'react';
import {
    type IconProps,
    type SearchResult,
    Tabs,
    useTabsContext,
    HStack,
    ScrollableArea,
    Heading,
    Slide,
    MapsGLSearchControl,
    useLocationContext,
    useDrawerContext,
    capitalizeWords
} from '@xweather/maps-ui-sdk';
import { useMapContext } from '../providers/MapProvider';
import { Box } from './Box';
import { SettingsControl } from './SettingsControl';
import { TooltipIconButton } from './TooltipIconButton';
import {
    SearchIcon,
    PreferencesOutlineFullIcon
} from './Icons';

interface TabButtonConfig {
    id: string;
    label: string;
    icon: ComponentType<IconProps>;
}

interface FloatingTabContentProps {
    buttonsRef: RefObject<HTMLDivElement>;
}

const TAB_BUTTONS: TabButtonConfig[] = [{
    id: 'search',
    label: 'Search',
    icon: SearchIcon
}, {
    id: 'settings',
    label: 'Settings',
    icon: PreferencesOutlineFullIcon
}] as const;

const FloatingTabButtons = () => {
    const { currentTab, setCurrentTab } = useTabsContext();

    const handleTabChange = (newTab: string) => {
        setCurrentTab(newTab === currentTab ? null : newTab);
    };

    return (
        <Box className="sm:flex-col">
            {TAB_BUTTONS.map(({ id, label, icon }) => (
                <TooltipIconButton
                    key={id}
                    icon={icon}
                    label={label}
                    onClick={() => handleTabChange(id)}
                    isActive={currentTab === id}
                />
            ))}
        </Box>
    );
};

const FloatingTabContent = ({ buttonsRef }: FloatingTabContentProps) => {
    const { currentTab } = useTabsContext();
    const { setCoordinates } = useLocationContext();
    const { close } = useDrawerContext();
    const { flyTo } = useMapContext();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearchResult = useCallback((result: SearchResult) => {
        const { loc: { lat, long } } = result;
        setCoordinates({ lat, lon: long });
        flyTo(lat, long, 7);
        close();
    }, [setCoordinates, flyTo, close]);

    useEffect(() => {
        if (currentTab === 'search') {
            searchInputRef.current?.focus();
        }
    }, [currentTab]);

    const tabsContent = useMemo(() => ({
        search: (
            <MapsGLSearchControl
                className="sm:w-90"
                inputRef={searchInputRef}
                onSelectResult={handleSearchResult}
            />
        ),
        settings: (
            <Box
                className="z-80 h-full pt-5 pb-1 min-w-65 max-w-65"
                orientation="vertical"
            >
                <HStack className="h-7 mx-4 mb-9 items-center">
                    <Heading level={2}>
                        {capitalizeWords(currentTab ?? '')}
                    </Heading>
                </HStack>
                <ScrollableArea className="max-h-[70vh]">
                    <SettingsControl />
                </ScrollableArea>
            </Box>
        )
    }), [currentTab, handleSearchResult]);

    return (
        <Tabs
            position="fixed"
            relativeToRef={buttonsRef}
            side={{ base: 'bottom', sm: 'left' }}
            align="start"
            offset={12}
        >
            <Tabs.Animation Animator={Slide}>
                {Object.entries(tabsContent).map(([id, content]) => (
                    <Tabs.Position key={id}>
                        <Tabs.AnimatedContent
                            className={id === 'search' ? 'sm:pt-2 w-full sm:w-fit' : ''}
                            value={id}
                        >
                            {content}
                        </Tabs.AnimatedContent>
                    </Tabs.Position>
                ))}
            </Tabs.Animation>
        </Tabs>
    );
};

export const FloatingControls = () => {
    const buttonsRef = useRef<HTMLDivElement>(null);

    return (
        <Tabs.Provider defaultValue="search">
            <FloatingTabContent buttonsRef={buttonsRef} />
            <div ref={buttonsRef}>
                <FloatingTabButtons />
            </div>
        </Tabs.Provider>
    );
};
