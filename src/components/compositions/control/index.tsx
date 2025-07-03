import clsx from 'clsx';
import { isNil } from '@aerisweather/javascript-utils';
import { CONTROL_TYPE } from '@/constants/control';
import {
    type ControlProps,
    type RadioGroupControlProps,
    type ToggleGroupControlProps,
    type SelectControlProps,
    type SliderControlProps,
    type CustomControlProps
} from '@/types/control';
import { Grid } from '@/components/primitives/layout/Grid';
import { RadioGroup } from '@/components/primitives/controls/RadioGroup';
import { ToggleGroup } from '@/components/primitives/controls/ToggleGroup';
import { Select } from '@/components/primitives/controls/Select';
import { DataSlider } from '@/components/primitives/controls/DataSlider';

/**
 * Renders a composed RadioGroup control built from ControlProps.
 */
const RadioGroupControl = (props: RadioGroupControlProps) => {
    const {
        optionProps,
        options,
        controlRefs,
        layout,
        className,
        classNames,
        ...radioProps
    } = props;
    const { component: OptionComponent, ...restOfOptionProps } = optionProps || {};

    return (
        <RadioGroup
            {...radioProps}
            ref={controlRefs?.rootRef}
            className={clsx(className, classNames?.root)}
        >
            <Grid {...layout}>
                {options.map((option) => (
                    <RadioGroup.Item
                        key={option.value}
                        ref={controlRefs?.itemRef}
                        asChild={Boolean(OptionComponent)}
                        className={classNames?.item}
                        {...restOfOptionProps}
                        {...option}

                    >
                        {OptionComponent ? <OptionComponent {...option} /> : option.label}
                    </RadioGroup.Item>
                ))}
            </Grid>
        </RadioGroup>
    );
};

/**
 * Renders a composed ToggleGroup control built from ControlProps.
 */
const ToggleGroupControl = (props: ToggleGroupControlProps) => {
    const {
        optionProps,
        options,
        controlRefs,
        layout,
        className,
        classNames,
        ...toggleProps
    } = props;
    const { component: OptionComponent, ...restOfOptionProps } = optionProps || {};

    return (
        <ToggleGroup
            {...toggleProps}
            ref={controlRefs?.rootRef}
            className={clsx(className, classNames?.root)}
        >
            <Grid {...layout}>
                {options.map((option) => (
                    <ToggleGroup.Item
                        key={option.value}
                        ref={controlRefs?.itemRef}
                        asChild={Boolean(OptionComponent)}
                        className={classNames?.item}
                        {...restOfOptionProps}
                        {...option}
                    >
                        {OptionComponent ? <OptionComponent {...option} /> : option.label}
                    </ToggleGroup.Item>
                ))}
            </Grid>
        </ToggleGroup>
    );
};

/**
 * A dynamic component for rendering predefined control types and custom components.
 *
 * @public
 *
 * @remarks
 * The component handles two main cases:
 * 1. When `component` is provided without `controlType`, it renders the custom component directly
 * 2. When `controlType` is provided, it renders one of the built-in controls
 *
 * Built-in controls include:
 * - RadioGroup
 * - ToggleGroup
 * - Select
 * - Slider
 *
 * @throws {Error} When an invalid controlType is provided
 */
export const Control = (props: ControlProps) => {
    const { controlType, ...rest } = props;

    // If a custom component is provided and no controlType is set, just render it.
    if ('component' in props && props.component && isNil(controlType)) {
        const Component = props.component;
        return <Component {...rest as CustomControlProps} />;
    }

    switch (controlType) {
        case CONTROL_TYPE.radioGroup: {
            return <RadioGroupControl {...rest as RadioGroupControlProps} />;
        }
        case CONTROL_TYPE.toggleGroup: {
            return <ToggleGroupControl {...rest as ToggleGroupControlProps} />;
        }
        case CONTROL_TYPE.select: {
            const { layout, ...selectProps } = rest;
            return <Select {...selectProps as SelectControlProps} />;
        }
        case CONTROL_TYPE.slider: {
            const { layout, ...sliderProps } = rest;
            return <DataSlider {...sliderProps as SliderControlProps} />;
        }
        default: {
            throw new Error(`Invalid control type: ${controlType}`);
        }
    }
};
