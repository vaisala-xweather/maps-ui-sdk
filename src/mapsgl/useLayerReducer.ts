import { useReducer, type Reducer } from 'react';
import { type LayerAction } from '@/types/action/layers';
import { type LayersState, type TrackedEffect } from '@/types/layer';
import { layerStateReducer } from '@/reducers/layerStateReducer';
import { createMapEffect } from '@/utils/layerEffects';
import { LAYER_EFFECT } from '@/constants/action';

export interface ReducerState {
    state: LayersState;
    previousState: LayersState;
    effects: TrackedEffect[];
}

/**
 * Custom hook that wraps the layer reducer with effect tracking
 * @param initialState Initial layer state
 * @returns [state, previousState, effects, dispatch]
 */
export function useLayerReducer(initialState: LayersState) {
    const initialEffects = Object.entries(initialState).map(([id, layer]) => (layer.active
        ? createMapEffect(LAYER_EFFECT.addToMap, id)
        : createMapEffect(LAYER_EFFECT.removeFromMap, id)));

    return useReducer<Reducer<ReducerState, LayerAction>>(
        ({ state, previousState, effects }, action) => {
            const result = layerStateReducer(
                state,
                action,
                effects,
                previousState
            );

            return {
                state: result.state,
                previousState: result.previousState,
                effects: result.effects
            } as const;
        },
        {
            state: initialState,
            previousState: initialState,
            effects: initialEffects
        }
    );
}
