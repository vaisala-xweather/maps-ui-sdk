import { CONTROL_TYPE } from '@/constants/control';
import {
    type ControlSetting,
    type RawOptions,
    type Option,
    type ToggleGroupSetting,
    type RadioGroupSetting,
    type SelectSetting,
    type SliderSetting,
    type NormalizedControlSetting,
    type CustomSetting,
    type ControlUnitsSetting,
    type OptionPropsSetting,
    type OptionProps,
    type ControlUnits
} from '@/types/control';

export const isValidControlUnits = (units: ControlUnitsSetting | undefined): units is ControlUnits => (
    Boolean(units?.measurementType)
);

/**
 * Normalizes different option formats into a consistent Option array structure.
 * Handles object-based options, numeric options, and primitive values.
 *
 * @param options - Array of options to normalize
 * @returns Array of normalized Option objects with consistent id, label, and value properties
 *
 */
export const normalizeOptions = (options: RawOptions): Option[] => options.map((option) => {
    if (typeof option === 'object' && option !== null) {
        const { value, ...rest } = option;
        const optionValue = value?.toString();
        return {
            ...rest,
            id: 'id' in option ? option.id : optionValue,
            label: option.label ?? optionValue,
            value: optionValue
        };
    }

    const optionValue = option.toString();
    return {
        id: optionValue,
        label: optionValue,
        value: optionValue

    };
});

const normalizeOptionProps = (props?: OptionPropsSetting): OptionProps | undefined => {
    if (!props) return undefined;

    const { units, ...rest } = props;

    if (!units) return rest;

    if (!isValidControlUnits(units)) {
        console.warn('Invalid units configuration', units);
        return rest;
    }

    return {
        ...rest,
        units: units as ControlUnits
    };
};

/**
 * Normalizes a single control setting by converting value/options/multiSelect to the correct format
 * based on the control type.
 *
 * @param controlSetting - Raw control setting to normalize
 * @returns Normalized control settings
 * @throws {Error} If setting has an unknown control type
 */
export const normalizeControlSetting = (controlSetting: ControlSetting): NormalizedControlSetting => {
    const { controlType, ...setting } = controlSetting;

    // Handle custom controls by passing through props
    if (!('controlType' in controlSetting)) {
        const customSetting = setting as CustomSetting;
        return customSetting;
    }

    // Handle predefined controls
    switch (controlType) {
        case CONTROL_TYPE.toggleGroup: {
            const { value, options, multiSelect, ...toggleGroupSetting } = controlSetting as ToggleGroupSetting;
            const selectionProps = multiSelect
                ? { multiSelect: true as const,
                    value: Array.isArray(value) ? value.map(String) : [] }
                : {
                    multiSelect: false as const,
                    value: value === null ? null : value?.toString() ?? null
                };
            return {
                ...toggleGroupSetting,
                ...selectionProps,
                options: options ? normalizeOptions(options) : [],
                optionProps: normalizeOptionProps(toggleGroupSetting.optionProps)
            };
        }
        case CONTROL_TYPE.radioGroup: {
            const { value, options, ...radioGroupSetting } = controlSetting as RadioGroupSetting;
            return {
                ...radioGroupSetting,
                options: options ? normalizeOptions(options) : [],
                optionProps: normalizeOptionProps(radioGroupSetting.optionProps),
                value: value?.toString()
            };
        }
        case CONTROL_TYPE.select: {
            const { value, options, ...selectSetting } = controlSetting as SelectSetting;
            return {
                ...selectSetting,
                options: options ? normalizeOptions(options) : [],
                value: value?.toString() ?? ''
            };
        }
        case CONTROL_TYPE.slider: {
            const { value, units, ...sliderSetting } = controlSetting as SliderSetting;
            const numericValue = value === null || value === undefined
                ? 0
                : Number(value);

            const normalizedSetting = {
                ...sliderSetting,
                value: Number.isFinite(numericValue) ? numericValue : 0
            };

            if (units) {
                if (!isValidControlUnits(units)) {
                    console.warn('Invalid units configuration for slider', units);
                    return normalizedSetting;
                }
                return {
                    ...normalizedSetting,
                    units: units as ControlUnits
                };
            }

            return normalizedSetting;
        }

        default: {
            throw new Error(`Invalid control type: ${controlType}`);
        }
    }
};

/**
 * Normalizes an array of control settings into Control component props.
 *
 * @param controlSettings - Array of raw control settings to normalize
 * @returns Array of normalized control props
 * @throws {TypeError} If controlSettings is not an array or contains invalid entries
 * @throws {Error} If a setting has an unknown control type or fails to normalize
 */
export const normalizeControlSettings = (
    controlSettings: ControlSetting[]
): NormalizedControlSetting[] => {
    if (!Array.isArray(controlSettings)) {
        throw new TypeError(
            `Invalid controlSettings: 
            Expected an array but received ${controlSettings === null ? 'null' : typeof controlSettings}`
        );
    }

    return controlSettings.map((controlSetting, index) => {
        if (controlSetting === null || controlSetting === undefined) {
            throw new TypeError(
                `Invalid control controlSetting at index ${index}: 
                Expected object but received ${controlSetting === null ? 'null' : 'undefined'}`
            );
        }

        if (typeof controlSetting !== 'object') {
            throw new TypeError(
                `Invalid control controlSetting at index ${index}: 
                Expected object but received ${typeof controlSetting}`
            );
        }

        try {
            return normalizeControlSetting(controlSetting);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new TypeError(
                    `Failed to normalize control setting at index ${index}: ${error.message}`
                );
            }
            throw error;
        }
    });
};
