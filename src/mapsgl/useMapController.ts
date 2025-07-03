import { useState, useEffect } from 'react';
import { Account, type AnyMapController } from '@aerisweather/mapsgl';
import { type MapEventHandlers, type MapControllerConfig } from '@/types/mapController';
import { getMapController } from '@/utils/mapController';

export type UseMapControllerProps = MapControllerConfig & Partial<MapEventHandlers>;

export function useMapController({
    map,
    strategy,
    accessKeys,
    options
}: UseMapControllerProps) {
    const [controller, setController] = useState<AnyMapController | null>(null);

    useEffect(() => {
        if (!map) {
            setController((prevController) => {
                prevController?.dispose();
                return null;
            });
            return;
        }
        let newController: AnyMapController | null = null;

        try {
            const account = new Account(accessKeys.id, accessKeys.secret);
            newController = getMapController(strategy, map, account, options);

            setController((prevController) => {
                prevController?.dispose();
                return newController;
            });
        } catch (error) {
            console.error('Error initializing map controller:', error);
            setController(null);
        }

        return () => {
            newController?.dispose();
        };
    }, [map, strategy, accessKeys, options]);

    return controller;
}
