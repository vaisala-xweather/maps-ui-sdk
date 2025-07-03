import { createContext, ReactNode, useContext, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCurrentLocation } from '@xweather/maps-ui-sdk';

export interface MapContextValue {
  map: mapboxgl.Map | null;
  isMapLoaded: boolean;
  flyTo: (lat: number, lon: number, zoom?: number) => void;
  geoLocate: () => Promise<void>;
  setMap: (map: mapboxgl.Map) => void;
  setIsMapLoaded: (loaded: boolean) => void;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export const useMapContext = (): MapContextValue => {
    const mapContext = useContext(MapContext);

    if (!mapContext) throw new Error('useMapContext must be used within a MapProvider');
    return mapContext;
};

export interface MapProviderProps {
  children: ReactNode;
}

export const MapProvider = ({ children }: MapProviderProps) => {
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const flyTo = useCallback((lat: number, lon: number, zoom?: number) => {
        if (!map) return;

        map.flyTo({
            center: [lon, lat],
            essential: true,
            ...(zoom && { zoom })
        });
    }, [map]);

    const geoLocate = useCallback(async () => {
        if (!map) return;

        try {
            const { lat, lon } = await getCurrentLocation();

            map.flyTo({ center: [lon, lat], zoom: 7, essential: true });
        } catch (error) {
            console.error('Geolocation error', error);
        }
    }, [map]);

    return (
        <MapContext.Provider
            value={{
                map,
                isMapLoaded,
                flyTo,
                geoLocate,
                setMap,
                setIsMapLoaded
            }}
        >
            {children}
        </MapContext.Provider>
    );
};
