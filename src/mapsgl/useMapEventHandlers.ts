import { useMemo, useEffect } from 'react';
import { type AnyMapController } from '@xweather/mapsgl';
import { MAP_EVENT_CONFIG } from '@/constants/mapController';
import {
    type MapEventHandlers,
    type MapEventName,
    type MapEventType
} from '@/types/mapController';

const useMergedEventHandlers = (customHandlers: Partial<MapEventHandlers>) => {
    const defaultHandlers = useMemo(() => Object.values(MAP_EVENT_CONFIG).reduce((acc, { eventName }) => {
        acc[eventName] = () => {};
        return acc;
    }, {} as Partial<MapEventHandlers>), []);

    return useMemo(() => ({ ...defaultHandlers, ...customHandlers }), [defaultHandlers, customHandlers]);
};

export const useMapEventHandlers = (
    controller: AnyMapController | null,
    customHandlers: Partial<MapEventHandlers>
) => {
    const handlers = useMergedEventHandlers(customHandlers);

    useEffect(() => {
        if (!controller) return;

        const attachedHandlers: Array<{
            eventName: MapEventName;
            handler: (e: MapEventType[MapEventName]) => void;
        }> = [];

        Object.entries(handlers).forEach(([eventName, handler]) => {
            const typedEventName = eventName as MapEventName;
            const typedHandler = handler as (e: MapEventType[MapEventName]) => void;

            (controller.on as any)(typedEventName, typedHandler);
            attachedHandlers.push({ eventName: typedEventName, handler: typedHandler });
        });

        return () => {
            attachedHandlers.forEach(({ eventName, handler }) => {
                (controller.off as any)(eventName, handler);
            });
        };
    }, [controller, handlers]);
};
