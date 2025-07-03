import { useMemo } from 'react';
import {
    useMapsGLMapControllerContext,
    MapsGLLayersProvider,
    MapsGLLayersControl,
    layerStateFromConfig
} from '@xweather/maps-ui-sdk';
import { layersConfig } from '../data/layers';

export const LayerControls = () => {
    const { controller } = useMapsGLMapControllerContext();
    const layerState = useMemo(() => layerStateFromConfig(layersConfig, controller), [controller]);

    return (
        <MapsGLLayersProvider initialState={layerState}>
            <MapsGLLayersControl config={layersConfig} />
        </MapsGLLayersProvider>
    );
};
