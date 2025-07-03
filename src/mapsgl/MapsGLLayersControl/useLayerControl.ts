import { LayerButtonOptions } from '@/types/layer';
import { getControlSettings } from '@/utils/layers';
import { useMapsGLLayersContext } from '@/mapsgl/MapsGLLayersProvider';
import { useMapsGLMapControllerContext } from '../MapsGLMapControllerProvider';

export const useLayerControl = (layer: LayerButtonOptions) => {
    const { controller } = useMapsGLMapControllerContext();
    const { layers, toggleLayer, ...rest } = useMapsGLLayersContext();

    const { id, settingsOptions } = layer;
    const isActive = layers[id]?.active || false;
    const settingsState = layers[id]?.settings;
    const controlSettings = settingsOptions
        ? getControlSettings(controller, layers[id], settingsOptions, settingsState)
        : null;

    const handleToggleLayer = (layerId?: string) => {
        const effectiveLayerId = layerId ?? id;
        toggleLayer(effectiveLayerId, layers[effectiveLayerId]);
    };

    return {
        isActive,
        controlSettings,
        settingsState,
        toggleLayer: handleToggleLayer,
        ...rest
    };
};
