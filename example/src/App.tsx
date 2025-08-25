import { useRef, useCallback } from 'react';
import { AnyMapController } from '@aerisweather/mapsgl';
import '@aerisweather/mapsgl/dist/mapsgl.css';
import { subHours, addHours } from 'date-fns';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    type MapsGLCoordinateEvent,
    type MapsGLEvent,
    type MapControllerOptions,
    MapsGLMapControllerProvider,
    MapsGLTimelineControl,
    Anchor,
    useDrawerContext,
    useLocationContext
} from '@xweather/maps-ui-sdk';
import '@xweather/maps-ui-sdk/dist/style.css';

import { useMapContext } from './providers/MapProvider';
import { MapControls } from './components/MapControls';
import { LocalWeatherViewer } from './components/LocalWeatherViewer';
import { SideDrawer } from './components/SideDrawer';
import { FloatingControls } from './components/FloatingControls';
import { useMapInit } from './hooks/useMapInit';

const accessKeys = {
    id: import.meta.env.VITE_MAPSGL_ID,
    secret: import.meta.env.VITE_MAPSGL_SECRET
};

const mapsGLControllerConfig: MapControllerOptions = {
    animation: {
        start: subHours(new Date(), 12),
        end: addHours(new Date(), 12)
    }
};

export default function App() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { close, isOpen } = useDrawerContext();
    const { map, flyTo } = useMapContext();
    const { setCoordinates } = useLocationContext();
    const boundaryLayerIds = useRef<string[]>([]);

    useMapInit(containerRef);

    const addBoundariesLayer = (controller: AnyMapController): Array<string> => {
        let beforeLayerId: string | undefined;

        if (map) {
            const layers = map.getStyle()?.layers ?? [];
            layers.forEach((layer) => {
                if (layer.type === 'line' && layer.id.startsWith('admin-1')) {
                    beforeLayerId = layer.id;
                }
            });
        }

        const layers = controller.addWeatherLayer('boundaries', {}, beforeLayerId);

        return Array.isArray(layers) ? layers.map((layer) => layer.id) : [];
    };

    const handleMapControllerLoad = (event: MapsGLEvent) => {
        if (boundaryLayerIds.current.length === 0) {
            const layerIds = addBoundariesLayer(event.target);
            boundaryLayerIds.current = layerIds;
        }
    };

    const handleMapClick = useCallback((event: MapsGLCoordinateEvent) => {
        if (isOpen) {
            close();
        }

        const data = event;

        if (data?.coord) {
            const { lat, lon } = data.coord;
            setCoordinates({ lat, lon });
            flyTo(lat, lon);
        }
    }, [isOpen, close, setCoordinates, flyTo]);

    return (
        <Anchor.Position offset={12} collisionPadding={12}>
            <MapsGLMapControllerProvider
                onLoad={handleMapControllerLoad}
                accessKeys={accessKeys}
                strategy="mapbox"
                map={map}
                onClick={handleMapClick}
                options={mapsGLControllerConfig}
            >
                <Anchor.Responsive
                    className="z-90"
                    anchor={{ base: 'bottom', sm: 'top-left' }}>
                    <LocalWeatherViewer />
                </Anchor.Responsive>

                <Anchor.Left offset={0}>
                    <SideDrawer />
                </Anchor.Left>

                <Anchor.TopRight className="z-80">
                    <FloatingControls />
                </Anchor.TopRight>

                <Anchor.BottomLeft offsetY={111} className="z-10">
                    <MapControls />
                </Anchor.BottomLeft>

                <Anchor.Bottom className="z-80 sm:z-90" offsetY={35}>
                    <MapsGLTimelineControl defaultExpanded={false} />
                </Anchor.Bottom>
            </MapsGLMapControllerProvider>

            <div ref={containerRef} id="map" />
        </Anchor.Position>
    );
}
