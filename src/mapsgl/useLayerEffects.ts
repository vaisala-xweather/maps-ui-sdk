import { useEffect } from 'react';
import { type AnyMapController, type ColorScaleOptions } from '@aerisweather/mapsgl';
import {
    type LayersState,
    type LayerState,
    type TrackedEffect,
    type ResolvedEffect,
    type RejectedEffect
} from '@/types/layer';
import { LAYER, LAYER_EFFECT } from '@/constants/action';
import {
    addLayerToMap,
    removeLayerFromMap,
    toggleLayerVisibility,
    updateMapLayerSetting
} from '@/mapsgl/mapLayerHandlers';
import { type LayerAction } from '@/types/action/layers';
import LayerNotFoundError from '@/utils/error/layer/layerNotFoundError';
import { isCompositeWeatherLayer } from '@/utils/layers';

export interface UseLayerEffectsProps {
    effects: TrackedEffect[];
    state: LayersState;
    previousState: LayersState;
    controller: AnyMapController;
    colorScales: Record<string, ColorScaleOptions>;
    dispatch: (action: LayerAction) => void;
}

const getRequiredLayer = (layerId: string, state: LayersState): LayerState => {
    const layer = state[layerId];
    if (!layer) {
        throw new LayerNotFoundError(layerId);
    }
    return layer;
};

export const useLayerEffects = ({
    effects,
    state,
    previousState,
    dispatch,
    controller,
    colorScales
}: UseLayerEffectsProps) => {
    useEffect(() => {
        if (effects.length === 0) return;

        const resolved: ResolvedEffect[] = [];
        const rejected: RejectedEffect[] = [];

        effects.forEach((effect) => {
            try {
                const layer = effect.type === LAYER_EFFECT.removeFromMap
                    ? getRequiredLayer(effect.layerId, previousState)
                    : getRequiredLayer(effect.layerId, state);

                switch (effect.type) {
                    case LAYER_EFFECT.addToMap: {
                        if (!controller.hasLayer(effect.layerId)) {
                            addLayerToMap(layer, controller, colorScales);
                        }
                        break;
                    }
                    case LAYER_EFFECT.removeFromMap: {
                        if (controller.hasLayer(effect.layerId)) {
                            removeLayerFromMap(layer, controller);
                        }
                        break;
                    }
                    case LAYER_EFFECT.toggleVisibility: {
                        toggleLayerVisibility(layer, controller, colorScales);
                        break;
                    }
                    case LAYER_EFFECT.updateSetting: {
                        if (isCompositeWeatherLayer(controller, layer)
                            || (controller.hasLayer(effect.layerId)
                                && effect.setting
                                && controller.weatherProvider.isWeatherLayer(layer.weatherId))) {
                            updateMapLayerSetting(layer, effect.setting, controller, colorScales);
                        }
                        break;
                    }
                    default: {
                        console.error('Unknown effect:', effect);
                    }
                }

                resolved.push({ id: effect.id, effect });
            } catch (error) {
                rejected.push({
                    id: effect.id,
                    effect,
                    error: error instanceof Error ? error : new Error('Unknown error')
                });
            }
        });

        dispatch({
            type: LAYER.resolveEffects,
            payload: {
                resolved,
                rejected,
                previousState
            }
        });
    }, [effects, state, previousState, dispatch, controller, colorScales]);
};
