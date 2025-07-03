import { ControlSetting } from './control';

export type ButtonOptionSetting = string | ControlSetting | Partial<ControlSetting>;

export interface ButtonOptions {
    id: string;
    title: string;
    value?: string;
    selected?: boolean;
    settingsOptions?: ButtonOptionSetting[];
}

export interface ButtonSegmentOptions extends ButtonOptions {
    multiselect?: boolean;
}

export type ButtonOptionsList = (ButtonOptions | SegmentedButtonOptions)[];

export interface SegmentedButtonOptions extends Omit <ButtonOptions, 'value'> {
    options: ButtonSegmentOptions[];
    selected?: boolean;
    multiselect?: boolean;
}

export interface ButtonGroupOptions {
    id?: string;
    title: string;
    group: (ButtonOptions | SegmentedButtonOptions)[];
    multiselect?: boolean;
}

export type ButtonListItem = ButtonGroupOptions | ButtonOptions | SegmentedButtonOptions;
