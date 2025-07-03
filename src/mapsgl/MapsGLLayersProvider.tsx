import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    ReactNode,
    useCallback
} from 'react';
import { type ColorScaleOptions } from '@aerisweather/mapsgl';
import { isEmpty } from '@aerisweather/javascript-utils';
import { LAYER } from '@/constants/action';
import {
    type LayersState,
    type InitialLayersState,
    type AddLayer,
    type RemoveLayer,
    type ToggleLayer,
    type UpdateLayerSetting
} from '@/types/layer';
import { isWeatherLayerConfiguration } from '@/utils/layers';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { isColorScaleOptions } from '@/types/colors';
import { useLayerReducer } from '@/mapsgl/useLayerReducer';
import { useLayerEffects } from '@/mapsgl/useLayerEffects';
import { useMapsGLMapControllerContext } from './MapsGLMapControllerProvider';

export interface MapsGLLayersContextProps {
    layers: LayersState;
    addLayer: AddLayer;
    removeLayer: RemoveLayer;
    toggleLayer: ToggleLayer;
    updateLayerSetting: UpdateLayerSetting;
}

export const MapsGLLayersContext = createContext<MapsGLLayersContextProps | null>(null);

export const useMapsGLLayersContext = () => {
    const context = useContext(MapsGLLayersContext);
    if (!context) {
        throw new Error('MapsGLLayersContext not found - must be used within MapsGLLayersProvider');
    }
    return context;
};

export interface MapsGLLayersProviderProps {
    children: ReactNode;
    initialState: InitialLayersState;
}

export const MapsGLLayersProvider = ({
    children,
    initialState
}: MapsGLLayersProviderProps) => {
    const { controller } = useMapsGLMapControllerContext();
    const { colorScales, updateSetting } = useSettingsContext();
    const [{ state, effects, previousState }, dispatch] = useLayerReducer(initialState as LayersState);
    useLayerEffects({
        effects,
        state,
        previousState,
        dispatch,
        controller,
        colorScales: colorScales ?? {}
    });

    useEffect(() => {
        const defaultColorScales: Record<string, ColorScaleOptions> = {};
        Object.entries(initialState).forEach(([layerId, layer]) => {
            if (!layer.weatherId) return;

            const isWeatherLayer = controller.weatherProvider.isWeatherLayer(layer.weatherId);

            const layerConfig = isWeatherLayer
                ? controller.weatherProvider.getWeatherLayerConfig(layer.weatherId)
                : null;

            const colorScale = isWeatherLayerConfiguration(layerConfig)
                ? layerConfig.layer?.paint?.sample?.colorscale
                : undefined;

            if (isColorScaleOptions(colorScale)) {
                defaultColorScales[layerId] = colorScale;
            }
        });

        if (!isEmpty(defaultColorScales)) {
            updateSetting('colorScales', defaultColorScales);
        }
    }, [initialState, controller, updateSetting]);

    const addLayer = useCallback<AddLayer>((layerId, layer) => {
        dispatch({ type: LAYER.add, payload: { id: layerId, value: layer } });
    }, [dispatch]);

    const removeLayer = useCallback<RemoveLayer>((layerId) => {
        dispatch({ type: LAYER.remove, payload: { id: layerId } });
    }, [dispatch]);

    const toggleLayer = useCallback<ToggleLayer>((layerId, layer) => {
        dispatch({ type: LAYER.toggle, payload: { id: layerId, value: layer } });
    }, [dispatch]);

    const updateLayerSetting = useCallback<UpdateLayerSetting>((layerId, setting) => {
        dispatch({ type: LAYER.updateSetting, payload: { id: layerId, value: setting } });
    }, [dispatch]);

    const contextValue = useMemo(() => ({
        layers: state,
        addLayer,
        removeLayer,
        toggleLayer,
        updateLayerSetting
    }), [state, addLayer, removeLayer, toggleLayer, updateLayerSetting]);

    return (
        <MapsGLLayersContext.Provider value={contextValue}>
            {children}
        </MapsGLLayersContext.Provider>
    );
};
