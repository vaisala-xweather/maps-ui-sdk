import { LAYER } from '@/constants/action';
import { LayerState, EffectResults } from '@/types/layer';
import { BasePayload, ValuePayload } from './dispatch';

export type LayerActionType = typeof LAYER[keyof typeof LAYER];

export interface LayerChangePayload extends BasePayload {
  segmentId: string,
  multiselect: boolean
}

export interface LayerUpdateSettingPayload extends BasePayload {
  value: ValuePayload
}

export interface LayerAddPayload extends BasePayload {
  value?: LayerState;
}

export interface LayerTogglePayload extends BasePayload {
  value?: LayerState;
}

export type LayerAction =
  | { type: typeof LAYER.add; payload: LayerAddPayload }
  | { type: typeof LAYER.remove; payload: BasePayload }
  | { type: typeof LAYER.toggle; payload: LayerTogglePayload }
  | { type: typeof LAYER.updateSetting; payload: LayerUpdateSettingPayload }
  | { type: typeof LAYER.resolveEffects; payload: EffectResults };
