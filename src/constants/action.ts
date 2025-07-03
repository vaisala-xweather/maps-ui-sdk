export const EVENT = {
    select: 'ON_SELECT',
    change: 'ON_CHANGE',
    update: 'ON_UPDATE',
    updateValue: 'ON_UPDATE_VALUE'
} as const;

export const LAYER = {
    add: 'ON_LAYER_ADD',
    remove: 'ON_LAYER_REMOVE',
    toggle: 'ON_LAYER_TOGGLE',
    updateSetting: 'ON_LAYER_SETTING_UPDATE',
    resolveEffects: 'ON_LAYER_EFFECTS_RESOLVE'
} as const;

export const LAYER_EFFECT = {
    addToMap: 'MAP_LAYER_ADD',
    removeFromMap: 'MAP_LAYER_REMOVE',
    toggleVisibility: 'MAP_LAYER_TOGGLE',
    updateSetting: 'MAP_LAYER_UPDATE'
} as const;
