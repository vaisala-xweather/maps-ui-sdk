import { type LayerEffect, type TrackedEffect } from '@/types/layer';
import { nanoid } from 'nanoid';
import { LAYER_EFFECT } from '@/constants/action';
import { type ValuePayload } from '@/types/action/dispatch';

const createTrackedEffect = (effect: LayerEffect): TrackedEffect => ({
    ...effect,
    id: nanoid()
});

export const createMapEffect = (
    type: typeof LAYER_EFFECT.addToMap
    | typeof LAYER_EFFECT.removeFromMap
    | typeof LAYER_EFFECT.toggleVisibility,
    layerId: string
): TrackedEffect => createTrackedEffect({
    type,
    layerId
});

export const createSettingEffect = (
    layerId: string,
    setting: ValuePayload
): TrackedEffect => createTrackedEffect({
    type: LAYER_EFFECT.updateSetting,
    layerId,
    setting
});
