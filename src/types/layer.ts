import { type WeatherLayerOptions } from '@xweather/mapsgl';
import { PaintStyleKeys } from '@/mapsgl/layerDataSchema';
import { type ButtonGroupOptions } from '@/types/buttonList';
import { type ControlSetting } from '@/types/control';
import { type ValuePayload } from '@/types/action/dispatch';
import { LAYER_EFFECT } from '@/constants/action';
import { type MapsGLUnitConversion } from '@/types/units';

export type PaintStyleKey = (typeof PaintStyleKeys)[keyof typeof PaintStyleKeys];

export type LayerSettings = Record<string, string | number | string[] | number[]>;

export interface LayerState {
    layerId: string;
    weatherId: string;
    active: boolean;
    settings?: LayerSettings;
    overrides?: LayerOverrides;
    childLayerIds?: string[];
    parentId?: string;
    groupId?: string;
    unitConversions?: Record<string, MapsGLUnitConversion>;
}

export interface LayersState {
    [layerId: string]: LayerState;
}

export type InitialLayerState = Omit<LayerState, 'weatherId' | 'active'> & {
    weatherId?: string;
    active?: boolean;
};

export interface InitialLayersState {
    [key: string]: InitialLayerState;
}

export interface LayerOverrides {
    beforeIds?: string[];
    layer?: Partial<WeatherLayerOptions>;
}

export type LayerButtonOptionSetting = string | Partial<ControlSetting & LayerState>;

export interface LayerButtonOptions {
    id: string;
    title: string;
    selected?: boolean;
    settingsOptions?: LayerButtonOptionSetting[]
    value?: string | {
        id: string;
        overrides: LayerOverrides;
    };
}

export interface LayerButtonSegmentOptions extends LayerButtonOptions {
    multiselect?: boolean;
}

export interface LayerSegmentedButtonOptions extends Omit <LayerButtonOptions, 'value'> {
    options: LayerButtonSegmentOptions[];
    selected?: boolean;
    multiselect?: boolean;
}

export interface LayerButtonGroupOptions extends Omit<ButtonGroupOptions, 'group'> {
    group: (LayerButtonOptions | LayerSegmentedButtonOptions)[];
    selected?: boolean;
    id?: string;
}

export type LayersConfigItem = LayerButtonOptions | LayerButtonGroupOptions | LayerSegmentedButtonOptions;

export type LayersConfig = LayersConfigItem[];

export interface WebGLLayer{
    readonly id: string;
    readonly visible: boolean;
    enabled: boolean;
    show(): void;
    hide(): void;
}

export interface GroupState {
    activeGroupId: string | null;
}

export type ToggleChildLayers = (layerId: string, childLayers: LayerState[]) => void;

export type AddLayer = (layerId: string, layer?: LayerState) => void;

export type RemoveLayer = (layerId: string) => void;

export type ToggleLayer = (layerId: string, layer?: LayerState) => void;

export type UpdateLayerSetting = (layerId: string, setting: ValuePayload) => void;

export type LayerEffect =
    | { type: typeof LAYER_EFFECT.addToMap; layerId: string }
    | { type: typeof LAYER_EFFECT.removeFromMap; layerId: string }
    | { type: typeof LAYER_EFFECT.toggleVisibility; layerId: string }
    | { type: typeof LAYER_EFFECT.updateSetting; layerId: string; setting: ValuePayload };

export type TrackedEffect = {
    id: string;
} & LayerEffect;

/**
 * Represents a successfully processed layer effect
 */
export type ResolvedEffect = {
    id: string;
    effect: LayerEffect;
};

/**
 * Represents a layer effect that failed to process
 */
export type RejectedEffect = {
    id: string;
    effect: LayerEffect;
    error: Error;
};

/**
 * Contains the results of processing layer effects
 */
export interface EffectResults {
    resolved: ResolvedEffect[];
    rejected: RejectedEffect[];
    previousState: LayersState;
}
