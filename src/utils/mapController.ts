import {
    Account,
    AnyMapController,
    MaplibreMapController,
    MapboxMapController,
    GoogleMapController,
    LeafletMapController
} from '@aerisweather/mapsgl';
import {
    type MapEventHandlers,
    type MapEventHandlerProps,
    type MapEventName,
    type MapEventType,
    type MapStrategyType,
    type MapControllerOptions,
    type Map
} from '@/types/mapController';
import { MAP_EVENT_CONFIG } from '@/constants/mapController';

export const buildMapEventHandlers = (
    props: Partial<MapEventHandlerProps>
): Partial<MapEventHandlers> => Object.values(MAP_EVENT_CONFIG)
    .reduce<Partial<MapEventHandlers>>((acc, { eventName, handlerName }) => {
        const handler = props[handlerName];
        if (typeof handler === 'function') {
            acc[eventName as MapEventName] = handler as (e: MapEventType[typeof eventName]) => void;
        }
        return acc;
    }, {});

export const getMapController = (
    strategy: MapStrategyType,
    map: Map,
    account: Account,
    options?: MapControllerOptions
): AnyMapController | null => {
    switch (strategy) {
        case 'maplibre': {
            return new MaplibreMapController(map, { account, ...options });
        }
        case 'mapbox': {
            return new MapboxMapController(map, { account, ...options });
        }
        case 'google': {
            return new GoogleMapController(map, { account, ...options });
        }
        case 'leaflet': {
            return new LeafletMapController(map, { account, ...options });
        }
        default: {
            return null;
        }
    }
};
