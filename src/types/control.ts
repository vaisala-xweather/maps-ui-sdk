import { ComponentType, Ref } from 'react';
import { MeasurementType, Unit, UnitPrecisionConfig } from '@/types/units';
import { CONTROL_TYPE } from '@/constants/control';
import { Nullable } from '@/types/utils';
import { GridProps } from '@/components/primitives/layout/Grid';

/**
 * Option configuration for control items
 */
export interface Option {
    id?: string;
    label: string;
    value: string;
    disabled?: boolean;
    selected?: boolean;
}

/**
 * Option configuration for numeric control items
 */
export interface NumericOption {
    label: string;
    value: number;
}

/**
 * Supported option types for controls
 */
export type RawOptions = Option[] | NumericOption[] | number[] | string[];

/**
 * Base units configuration for controls that support measurement conversion
 */
export interface ControlUnitsBase {
  precision?: UnitPrecisionConfig;
  scaleConversion?: boolean;
  measurementType: MeasurementType;
}

/**
 * Units setting for controls that support measurement conversion
 */
export interface ControlUnitsSetting extends ControlUnitsBase {
    base?: Unit;
}

/**
 * Units configuration for controls that support measurement conversion
 */
export interface ControlUnits extends ControlUnitsBase {
    base: Unit;
}

/**
 * Base options for settings that accept raw options
 */
export interface OptionsSettingBase {
    options: RawOptions;
}

/**
 * Base for control props that require normalized options
 */
export interface OptionsBase {
    options: Option[];
}

/**
 * Base props for option components i.e. RadioGroup.Item, etc.
 */
export interface OptionPropsBase {
    className?: string;
    component?: ComponentType<any>;
}

/**
 * Props for option components i.e. RadioGroup.Item, etc.
 */
export interface OptionProps extends OptionPropsBase {
    units?: ControlUnits;
}

/**
 * Option props setting for option components i.e. RadioGroup.Item, etc.
 */
export interface OptionPropsSetting extends OptionPropsBase {
    units?: ControlUnitsSetting;
}

/**
 * Base for props with group options (RadioGroup, ToggleGroup).
 */
export interface ControlGroupBase {
    controlRefs?: ControlGroupRefs;
}

/**
 * Base for settings with group options
 */
export type ControlGroupSetting = ControlGroupBase & OptionsSettingBase & {
    optionProps?: OptionPropsSetting;
};

/**
 * Base for props with group options
 */
export type ControlGroupProps = ControlGroupBase & OptionsBase & {
    optionProps?: OptionProps;
};

/**
 * Base interface for all control properties
 */
export interface ControlBase {
    id?: string;
    className?: string;
    classNames?: Record<string, string>;
    layout?: Omit<GridProps, 'children'>;
}

/**
 * Base settings for controls, i.e. ToggleGroup, RadioGroup, Select, Slider or custom.
 * Note: `name` is required for all control settings.
 */
export interface ControlSettingBase extends ControlBase {
    name: string;
    label?: string;
    parentId?: string;
}

/**
 * Base props for controls, i.e. ToggleGroup, RadioGroup, Select, Slider or custom.
 * Note: name is optional for all control props which could be used for form integration.
 */
export interface ControlPropsBase extends ControlBase {
    name?: string;
    ariaLabelledby?: string;
}

/**
 * Refs for control group components
 */
export interface ControlGroupRefs {
    rootRef?: Ref<HTMLDivElement>;
    itemRef?: Ref<HTMLButtonElement>;
}

/**
 * Selection configuration for toggle group component props
 */
export type ToggleGroupSelectionProps =
    | {
        multiSelect?: false;
        value?: Nullable<string>;
        onValueChange: (value: Nullable<string>) => void;
    }
    | {
        multiSelect: true;
        value?: string[];
        onValueChange: (value: string[]) => void;
    };

/**
 * Selection configuration for toggle group settings
 */
export type ToggleGroupSettingSelection =
    | {
        multiSelect?: false;
        value: string | number | null;
    }
    | {
        multiSelect: true;
        value: string[] | number[];
    };

/**
 * Selection configuration for normalized toggle group settings
 */
export type NormalizedToggleGroupSelection =
    | { multiSelect?: false; value: Nullable<string> }
    | { multiSelect: true; value: string[] };

/**
 * Base props for slider controls
 */
export interface SliderBase extends ControlBase {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    controlRef?: Ref<HTMLInputElement>;
    valueFormatter?: (value: number) => string | null | undefined;
}

/**
 * Props for toggle group component
 */
export type ToggleGroupControlProps = ControlPropsBase & ControlGroupProps & ToggleGroupSelectionProps;

/**
 * Props for radio group component
 */
export type RadioGroupControlProps = ControlPropsBase & ControlGroupProps & {
    value?: string;
    onValueChange: (value: string) => void;
};

/**
 * Props for select component
 */
export type SelectControlProps = ControlPropsBase & OptionsBase & {
    value: string;
    onValueChange: (value: string) => void;
};

/**
 * Props for slider component
 */
export type SliderControlProps = ControlPropsBase & SliderBase & {
    units?: ControlUnits;
    onValueChange: (value: number) => void;
};

/**
 * Props for custom control components
 */
export interface CustomControlProps extends ControlPropsBase {
    component?: ComponentType<any>;
    value?: any;
    onValueChange?: (value: any) => void;
    [key: string]: any;
}

/**
 * Combined types for control props with control type discriminator externally defined
 * because control props are used in the control component implementation.
 *
 * Note: controlType is required for all control props except custom control props.
 */
export type ControlProps =
    | (ToggleGroupControlProps & { controlType: typeof CONTROL_TYPE.toggleGroup })
    | (RadioGroupControlProps & { controlType: typeof CONTROL_TYPE.radioGroup })
    | (SelectControlProps & { controlType: typeof CONTROL_TYPE.select })
    | (SliderControlProps & { controlType: typeof CONTROL_TYPE.slider })
    | CustomControlProps & { controlType?: never };

/**
 * Settings for toggle group control configuration
 */
export type ToggleGroupSetting = ControlSettingBase & ControlGroupSetting & ToggleGroupSettingSelection & {
    controlType: typeof CONTROL_TYPE.toggleGroup;
};

/**
 * Settings for radio group control configuration
 */
export type RadioGroupSetting = ControlSettingBase & ControlGroupSetting & {
    controlType: typeof CONTROL_TYPE.radioGroup;
    value?: string | number;
};

/**
 * Settings for select control configuration
 */
export type SelectSetting = ControlSettingBase & OptionsBase & {
    controlType: typeof CONTROL_TYPE.select;
    value: string | number;
};

/**
 * Settings for slider control configuration
 */
export type SliderSetting = ControlSettingBase & SliderBase & {
    units?: ControlUnitsSetting;
    controlType: typeof CONTROL_TYPE.slider;
};

/**
 * Settings for custom control configuration
 */
export interface CustomSetting extends ControlSettingBase {
    component?: ComponentType<any>;
    value?: any;
    units?: ControlUnitsSetting;
    [key: string]: any;
    controlType?: never;
}

/**
 * Combined types for control settings with control type discriminator
 */
export type ControlSetting =
    | ToggleGroupSetting
    | RadioGroupSetting
    | SelectSetting
    | SliderSetting
    | CustomSetting;

/**
 * Normalized settings for toggle group control
 */
export type NormalizedToggleGroupSetting = ControlSettingBase
    & ControlGroupProps
    & NormalizedToggleGroupSelection
    & {
        controlType: typeof CONTROL_TYPE.toggleGroup;
    };

/**
 * Normalized settings for radio group control
 */
export type NormalizedRadioGroupSetting = ControlSettingBase & ControlGroupProps & {
    value?: string;
    controlType: typeof CONTROL_TYPE.radioGroup;
};

/**
 * Normalized settings for select control
 */
export type NormalizedSelectSetting = ControlSettingBase & OptionsBase & {
    value: string;
    controlType: typeof CONTROL_TYPE.select;
};

/**
 * Normalized settings for custom control
 */
export type NormalizedCustomSetting = CustomSetting & {
    options?: Option[];
};

/**
 * Normalized settings for slider control
 */
export type NormalizedSliderSetting = ControlSettingBase & SliderBase & {
    units?: ControlUnits;
    controlType: typeof CONTROL_TYPE.slider;
};

/**
 * Combined types for normalized control settings with control type discriminator
 */
export type NormalizedControlSetting =
    | NormalizedToggleGroupSetting
    | NormalizedRadioGroupSetting
    | NormalizedSelectSetting
    | NormalizedSliderSetting
    | NormalizedCustomSetting;
