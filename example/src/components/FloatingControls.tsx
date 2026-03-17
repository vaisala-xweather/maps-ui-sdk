import { useRef, useEffect, useCallback, RefObject, useState } from 'react';
import {
    type SearchResult,
    Tabs,
    Slide,
    MapsGLSearchControl,
    useLocationContext,
    useDrawerContext
} from '@xweather/maps-ui-sdk';
import { useMapContext } from '../providers/MapProvider';
import { Box } from './Box';
import { TooltipIconButton } from './TooltipIconButton';
import { SearchIcon } from './Icons';

interface FloatingSearchContentProps {
    buttonsRef: RefObject<HTMLDivElement>;
    isSearchVisible: boolean;
}

interface FloatingSearchToggleButtonProps {
    isActive: boolean;
    onToggle: () => void;
}

const FloatingSearchToggleButton = ({ isActive, onToggle }: FloatingSearchToggleButtonProps) => (
    <Box className="sm:flex-col">
        <TooltipIconButton
            icon={SearchIcon}
            label="Search"
            onClick={onToggle}
            isActive={isActive}
        />
    </Box>
);

const FloatingSearchContent = ({
    buttonsRef,
    isSearchVisible
}: FloatingSearchContentProps) => {
    const { setCoordinates } = useLocationContext();
    const { close } = useDrawerContext();
    const { flyTo } = useMapContext();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearchResult = useCallback((result: SearchResult) => {
        const { coordinates } = result;
        setCoordinates(coordinates);
        flyTo(coordinates.lat, coordinates.lon, 7);
        close();
    }, [setCoordinates, flyTo, close]);

    useEffect(() => {
        if (isSearchVisible) {
            searchInputRef.current?.focus();
        }
    }, [isSearchVisible]);

    return (
        <Tabs
            position="fixed"
            relativeToRef={buttonsRef}
            side={{ base: 'bottom', sm: 'left' }}
            align="start"
            offset={12}
        >
            <Tabs.Animation Animator={Slide}>
                <Tabs.Position>
                    <Tabs.AnimatedContent
                        className="sm:pt-2 w-full sm:w-fit"
                        value="search"
                    >
                        <MapsGLSearchControl
                            className="sm:w-90"
                            inputRef={searchInputRef}
                            onSelectResult={handleSearchResult}
                        />
                    </Tabs.AnimatedContent>
                </Tabs.Position>
            </Tabs.Animation>
        </Tabs>
    );
};

export const FloatingControls = () => {
    const buttonsRef = useRef<HTMLDivElement>(null);
    const [isSearchVisible, setIsSearchVisible] = useState(true);
    const handleSearchToggle = useCallback(() => {
        setIsSearchVisible((previousValue) => !previousValue);
    }, []);

    return (
        <Tabs.Provider value={isSearchVisible ? 'search' : null}>
            <FloatingSearchContent
                buttonsRef={buttonsRef}
                isSearchVisible={isSearchVisible}
            />
            <div ref={buttonsRef}>
                <FloatingSearchToggleButton
                    isActive={isSearchVisible}
                    onToggle={handleSearchToggle}
                />
            </div>
        </Tabs.Provider>
    );
};
