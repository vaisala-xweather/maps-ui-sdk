import { useEffect, useRef, type RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapboxOptions } from 'mapbox-gl';
import { useSettingsContext } from '@xweather/maps-ui-sdk';
import { useMapContext, GLOBE_FOG } from '../providers/MapProvider';

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY;

export const useMapInit = (
    containerRef: RefObject<HTMLDivElement>,
    options?: Partial<Omit<MapboxOptions, 'projection'>>
) => {
    const { mapProjection } = useSettingsContext();
    const { setMap, setIsMapLoaded } = useMapContext();
    const initialOptionsRef = useRef(options);
    const initialProjectionRef = useRef(mapProjection);

    useEffect(() => {
        if (!containerRef.current) return;

        mapboxgl.accessToken = MAPBOX_KEY;

        const projection = initialProjectionRef.current === 'globe' ? 'globe' : 'mercator';

        const instance = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/dark-v9',
            center: [-74.5, 40],
            zoom: 3,
            ...initialOptionsRef.current,
            projection
        });

        instance.on('style.load', () => {
            if (projection === 'globe') {
                instance.setFog(GLOBE_FOG);
            }
        });

        instance.on('load', () => setIsMapLoaded(true));

        setMap(instance);

        return () => {
            instance.remove();
            setIsMapLoaded(false);
            setMap(null);
        };
    }, [containerRef, setMap, setIsMapLoaded]);
};
