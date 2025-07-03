import { LAYER, LAYER_EFFECT } from '@/constants/action';
import { type LayerAction } from '@/types/action/layers';
import {
    type LayersState,
    type LayerState,
    type TrackedEffect
} from '@/types/layer';
import { createMapEffect, createSettingEffect } from '@/utils/layerEffects';
import { removeItem } from '@/utils/array';
import { buildBaseLayerState } from '@/utils/layers';

export interface ReducerResult {
    state: LayersState;
    effects: TrackedEffect[];
    previousState: LayersState;
}

const removeFromParent = (
    state: LayersState,
    layerId: string,
    parentId: string
): LayersState => {
    const parentLayer = state[parentId];
    if (!parentLayer?.childLayerIds) return state;

    return {
        ...state,
        [parentId]: {
            ...parentLayer,
            childLayerIds: removeItem(parentLayer.childLayerIds, layerId)
        }
    };
};

const handleAddLayer = (
    state: LayersState,
    id: string,
    value: LayerState | undefined,
    effects: TrackedEffect[],
    previousState: LayersState
): ReducerResult => {
    const effectiveLayer = buildBaseLayerState({
        ...value,
        layerId: id,
        active: true
    });

    const newState = {
        ...state,
        [id]: effectiveLayer
    };

    effects.push(createMapEffect(LAYER_EFFECT.addToMap, id));

    if (effectiveLayer.childLayerIds) {
        effectiveLayer.childLayerIds.forEach((childId) => {
            newState[childId] = {
                ...newState[childId] ?? buildBaseLayerState({
                    layerId: childId,
                    parentId: id
                }),
                active: Boolean(effectiveLayer.settings?.[childId])
            };

            if (effectiveLayer.settings?.[childId]) {
                effects.push(createMapEffect(LAYER_EFFECT.addToMap, childId));
            }
        });
    }

    return { state: newState, effects, previousState };
};

const handleRemoveLayer = (
    state: LayersState,
    id: string,
    effects: TrackedEffect[],
    previousState: LayersState
): ReducerResult => {
    const layer = state[id];
    if (!layer) {
        console.warn(`Attempted to remove non-existent layer: ${id}`);
        return {
            state,
            effects,
            previousState
        };
    }

    let newState = { ...state };
    delete newState[id];
    const newEffects = [createMapEffect(LAYER_EFFECT.removeFromMap, id)];

    if (layer.parentId) {
        newState = removeFromParent(newState, id, layer.parentId);
    }

    if (layer.childLayerIds?.length) {
        layer.childLayerIds.forEach((childId) => {
            delete newState[childId];
            newEffects.push(createMapEffect(LAYER_EFFECT.removeFromMap, childId));
        });
    }

    return {
        state: newState,
        effects: [...effects, ...newEffects],
        previousState
    };
};

const handleToggleLayer = (
    state: LayersState,
    id: string,
    value: LayerState | undefined,
    effects: TrackedEffect[],
    previousState: LayersState
): ReducerResult => {
    const existingLayer = state[id];

    if (!existingLayer) {
        return handleAddLayer(state, id, value, effects, previousState);
    }

    const newActive = !existingLayer.active;
    const toggledLayer: LayerState = {
        ...existingLayer,
        ...value,
        active: newActive
    };

    const updatedState = {
        ...state,
        [id]: toggledLayer
    };

    const newEffects = [createMapEffect(LAYER_EFFECT.toggleVisibility, id)];

    if (toggledLayer.childLayerIds?.length) {
        toggledLayer.childLayerIds.forEach((childId) => {
            updatedState[childId] = {
                ...updatedState[childId] ?? buildBaseLayerState({
                    layerId: childId,
                    parentId: id
                }),
                active: newActive && Boolean(toggledLayer.settings?.[childId])
            };
            newEffects.push(createMapEffect(LAYER_EFFECT.toggleVisibility, childId));
        });
    }

    return { state: updatedState, effects: [...effects, ...newEffects], previousState };
};

export const layerStateReducer = (
    state: LayersState,
    action: LayerAction,
    currentEffects: TrackedEffect[] = [],
    previousState: LayersState = state
): ReducerResult => {
    const effects: TrackedEffect[] = [...currentEffects];

    switch (action.type) {
        case LAYER.add: {
            const { id, value } = action.payload;
            return handleAddLayer(state, id, value, effects, previousState);
        }

        case LAYER.remove: {
            const { id } = action.payload;
            return handleRemoveLayer(state, id, effects, previousState);
        }

        case LAYER.toggle: {
            const { id, value } = action.payload;
            return handleToggleLayer(state, id, value, effects, previousState);
        }

        case LAYER.updateSetting: {
            const { id: layerId, value: controlData } = action.payload;
            const { id: controlId, value: controlValue } = controlData;
            const layer = state[layerId];
            if (!layer) {
                console.warn(`Attempted to update setting for non-existent layer: ${layerId}`);
                return {
                    state,
                    effects,
                    previousState
                };
            }

            const newState = {
                ...state,
                [layerId]: {
                    ...layer,
                    settings: {
                        ...layer.settings,
                        [controlId]: controlValue
                    }
                }
            };

            effects.push(createSettingEffect(layerId, controlData));

            return {
                state: newState,
                effects,
                previousState
            };
        }

        case LAYER.resolveEffects: {
            const { resolved, rejected } = action.payload;

            const remainingEffects = effects.filter((effect) => (
                !resolved.some((resolvedEffect) => resolvedEffect.id === effect.id)
                && !rejected.some((rejectedEffect) => rejectedEffect.id === effect.id)
            ));

            if (rejected.length > 0) {
                return {
                    state: previousState,
                    effects: remainingEffects,
                    previousState
                };
            }
            return {
                state,
                effects: remainingEffects,
                previousState
            };
        }

        default: {
            return { state, effects: currentEffects, previousState };
        }
    }
};
