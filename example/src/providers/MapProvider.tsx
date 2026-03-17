import { createContext, ReactNode, useContext, useState, useCallback, useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCurrentLocation, useSettingsContext } from '@xweather/maps-ui-sdk';

export type MapProjection = 'mercator' | 'globe';

export const GLOBE_FOG: mapboxgl.FogSpecification = {
    'color': 'rgb(186, 210, 235)',
    'high-color': 'rgb(36, 92, 223)',
    'horizon-blend': 0.02,
    'space-color': 'rgb(11, 11, 25)',
    'star-intensity': 0.6
};

export interface MapContextValue {
  map: mapboxgl.Map | null;
  isMapLoaded: boolean;
  currentProjection: MapProjection;
  flyTo: (lat: number, lon: number, zoom?: number) => void;
  geoLocate: () => Promise<void>;
  toggleProjection: () => void;
  setMap: (map: mapboxgl.Map | null) => void;
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
    const { mapProjection, updateSetting } = useSettingsContext();
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    mapRef.current = map;

    const currentProjection: MapProjection = mapProjection === 'globe' ? 'globe' : 'mercator';

    const toggleProjection = useCallback(() => {
        const newProjection: MapProjection = mapRef.current?.getProjection()?.name === 'globe'
            ? 'mercator'
            : 'globe';

        mapRef.current?.setProjection(newProjection);
        mapRef.current?.setFog(newProjection === 'globe' ? GLOBE_FOG : null);
        updateSetting('mapProjection', newProjection);
    }, [updateSetting]);

    const flyTo = useCallback((lat: number, lon: number, zoom?: number) => {
        mapRef.current?.flyTo({
            center: [lon, lat],
            essential: true,
            ...(zoom != null && { zoom })
        });
    }, []);

    const geoLocate = useCallback(async () => {
        if (!mapRef.current) return;

        try {
            const { lat, lon } = await getCurrentLocation();

            mapRef.current.flyTo({ center: [lon, lat], zoom: 7, essential: true });
        } catch (error) {
            console.error('Geolocation error', error);
        }
    }, []);

    const value = useMemo<MapContextValue>(() => ({
        map,
        isMapLoaded,
        currentProjection,
        flyTo,
        geoLocate,
        toggleProjection,
        setMap,
        setIsMapLoaded
    }), [map, isMapLoaded, currentProjection, flyTo, geoLocate, toggleProjection]);

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
};
