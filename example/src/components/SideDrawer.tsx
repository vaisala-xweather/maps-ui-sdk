import { ComponentType, useCallback } from 'react';
import clsx from 'clsx';
import {
    type IconProps,
    Tabs,
    useTabsContext,
    Drawer,
    LoadingSpinner,
    HStack,
    ScrollableArea,
    Heading,
    Anchor,
    useDrawerContext,
    useLoadingContext,
    capitalizeWords
} from '@xweather/maps-ui-sdk';
import { Box } from './Box';
import { LayerControls } from './LayerControls';
import { SettingsControl } from './SettingsControl';
import { TooltipIconButton } from './TooltipIconButton';
import { ICON_BUTTON_STYLES } from './IconButton';
import {
    StackIcon,
    PreferencesOutlineFullIcon
} from './Icons';

const DRAWER_TABS = {
    layers: 'layers',
    settings: 'settings'
} as const;

const DRAWER_LABELS = {
    [DRAWER_TABS.layers]: 'Layers',
    [DRAWER_TABS.settings]: 'Settings'
} as const;

type DrawerTabValue = typeof DRAWER_TABS[keyof typeof DRAWER_TABS];

interface DrawerTriggerButtonProps {
    icon: ComponentType<IconProps>;
    label: string;
    tabId: DrawerTabValue;
}

interface DrawerButtonProps {
    icon: ComponentType<IconProps>;
    value: DrawerTabValue;
}

const DrawerTriggerButton = ({
    icon,
    label,
    tabId
}: DrawerTriggerButtonProps) => {
    const { currentTab, setCurrentTab } = useTabsContext();
    const { isOpen, open } = useDrawerContext();

    const handleClick = useCallback(() => {
        setCurrentTab(tabId);
        open();
    }, [tabId, setCurrentTab, open]);

    const isActive = isOpen && currentTab === tabId;

    return (
        <TooltipIconButton
            icon={icon}
            label={label}
            onClick={handleClick}
            isActive={isActive}
        />
    );
};

const DrawerButton = ({
    icon,
    value
}: DrawerButtonProps) => {
    const { isCurrent } = useTabsContext();
    const isActive = isCurrent(value);

    const className = clsx(
        ICON_BUTTON_STYLES.base,
        ICON_BUTTON_STYLES.size.md,
        !isActive && ICON_BUTTON_STYLES.hover,
        isActive && ICON_BUTTON_STYLES.active
    );

    return (
        <Tabs.Button
            className={className}
            icon={icon}
            value={value}
        />
    );
};

const DrawerTriggerButtons = () => (
    <Anchor.TopLeft className="z-80">
        <Box className="sm:flex-col">
            <DrawerTriggerButton
                icon={StackIcon}
                label={DRAWER_LABELS[DRAWER_TABS.layers]}
                tabId={DRAWER_TABS.layers}
            />
            <DrawerTriggerButton
                icon={PreferencesOutlineFullIcon}
                label={DRAWER_LABELS[DRAWER_TABS.settings]}
                tabId={DRAWER_TABS.settings}
            />
        </Box>
    </Anchor.TopLeft>
);

const DrawerHeader = () => {
    const { currentTab } = useTabsContext();
    const { loading } = useLoadingContext();

    const shouldShowSpinner = loading && currentTab === DRAWER_TABS.layers;

    return (
        <HStack className="h-8 mx-4 mt-5 mb-9 items-center">
            <Heading level={2}>
                {capitalizeWords(currentTab ?? '')}
            </Heading>
            {shouldShowSpinner && <LoadingSpinner className="ml-3" />}
        </HStack>
    );
};

const DrawerTabButtons = () => (
    <Tabs.List>
        <DrawerButton icon={StackIcon} value={DRAWER_TABS.layers} />
        <DrawerButton icon={PreferencesOutlineFullIcon} value={DRAWER_TABS.settings} />
    </Tabs.List>
);

const DrawerContent = () => (
    <Tabs>
        <DrawerHeader />
        <ScrollableArea>
            <Tabs.AnimatedContent value={DRAWER_TABS.layers}>
                <LayerControls />
            </Tabs.AnimatedContent>
            <Tabs.AnimatedContent value={DRAWER_TABS.settings}>
                <SettingsControl />
            </Tabs.AnimatedContent>
        </ScrollableArea>
        <DrawerTabButtons />
    </Tabs>
);

export const SideDrawer = () => (
    <Tabs.Provider>
        <DrawerTriggerButtons />
        <Drawer className="z-100">
            <DrawerContent />
        </Drawer>
    </Tabs.Provider>
);
