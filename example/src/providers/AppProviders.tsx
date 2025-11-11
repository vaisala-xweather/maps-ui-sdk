import { ReactNode, useCallback } from 'react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import {
    ModalProvider,
    SettingsProvider,
    LoadingProvider,
    DrawerProvider,
    InitialSettings,
    useModalContext,
    LocationProvider
} from '@xweather/maps-ui-sdk';
import type { Coordinates } from '@xweather/maps-ui-sdk/types/location';
import { MapProvider } from './MapProvider';

interface AppProvidersProps {
  children: ReactNode;
  initialSettings: InitialSettings;
}

const InnerProviders = ({
    children,
    initialSettings
}: AppProvidersProps) => {
    const { setModalData } = useModalContext();

    const handleChange = useCallback((coordinates: Coordinates | null) => {
        if (coordinates) {
            setModalData({ id: 'data-viewer' });
        }
    }, [setModalData]);

    return (
        <SettingsProvider initialSettings={initialSettings}>
            <LoadingProvider>
                <DrawerProvider>
                    <MapProvider>
                        <LocationProvider onChange={handleChange}>
                            <TooltipProvider delayDuration={0}>
                                {children}
                            </TooltipProvider>
                        </LocationProvider>
                    </MapProvider>
                </DrawerProvider>
            </LoadingProvider>
        </SettingsProvider>
    );
};

export const AppProviders = ({
    children,
    initialSettings
}: AppProvidersProps) => (
    <ModalProvider>
        <InnerProviders initialSettings={initialSettings}>
            {children}
        </InnerProviders>
    </ModalProvider>
);
