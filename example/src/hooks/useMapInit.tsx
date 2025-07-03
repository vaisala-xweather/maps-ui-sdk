import { useEffect, type RefObject } from 'react';
import type { MapboxOptions } from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
import { useMapContext } from '../providers/MapProvider';

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_KEY;

export const useMapInit = (
    containerRef: RefObject<HTMLDivElement>,
    options?: Partial<MapboxOptions>
) => {
    const { setMap, setIsMapLoaded } = useMapContext();

    useEffect(() => {
        if (!containerRef.current) return;

        mapboxgl.accessToken = MAPBOX_KEY;

        const instance = new mapboxgl.Map({
            container: containerRef.current,
            style: 'mapbox://styles/mapbox/dark-v9',
            center: [-74.5, 40],
            zoom: 3,
            ...options
        });

        instance.on('load', () => setIsMapLoaded(true));

        setMap(instance);

        return () => {
            instance.remove();
        };
    }, [containerRef, setMap, setIsMapLoaded, options]);
};
