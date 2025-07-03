import { forwardRef, useId } from 'react';
import * as Slider from '@radix-ui/react-slider';
import clsx from 'clsx';
import { HStack } from '@/components/primitives/layout/Stack';
import { ControlUnits } from '@/types/control';
import { FormattedValue } from '@/components/primitives/display/FormattedValue';
import { UnitValue } from '@/components/primitives/display/UnitValue';

export interface DataSliderProps {
    /** Optional id for the slider */
    id?: string;
    /** Optional name for form submission */
    name?: string;
    /** Optional className for styling the container */
    className?: string;
    /** Optional classNames for granular styling of the slider components */
    classNames?: {
        container?: string;
        root?: string;
        track?: string;
        range?: string;
        thumb?: string;
        label?: string;
    };
    /** Current value of the slider */
    value: number;
    /** Minimum value (default: 0) */
    min?: number;
    /** Maximum value (default: 100) */
    max?: number;
    /** Step increment (default: 1) */
    step?: number;
    /** Optional aria-labelledby attribute for accessibility */
    ariaLabelledby?: string;
    /** Optional aria-label attribute for accessibility */
    ariaLabel?: string;
    /** Units configuration for the slider */
    units?: ControlUnits;
    /** Callback when slider value changes */
    onValueChange: (value: number) => void;
    /** Optional custom formatter for the displayed value. Return null/undefined to use default formatting */
    valueFormatter?: (value: number) => string | null | undefined;
}

const classNameBase = {
    container: 'xw-data-slider-container xw-items-center',
    root: 'xw-data-slider-root xw-relative xw-touch-none xw-select-none xw-flex-shrink-0 xw-shrink-0 xw-cursor-pointer',
    track: 'xw-data-slider-track xw-relative xw-rounded-full',
    range: 'xw-data-slider-range xw-absolute xw-h-full xw-rounded-full',
    thumb: 'xw-data-slider-thumb xw-block xw-rounded-full focus:xw-outline-none',
    label: 'xw-data-slider-label xw-text-right'
};

const classNameDefault = {
    container: 'xw-w-full',
    root: 'xw-flex xw-flex-1 xw-items-center xw-py-3 ',
    track: 'xw-h-[2px] xw-grow xw-bg-slate-600',
    range: 'xw-bg-slate-600',
    thumb: `xw-h-3 xw-w-3 xw-bg-white xw-shadow-md 
            hover:xw-bg-gray-50 focus:xw-ring-2 focus:xw-ring-gray-400`,
    label: 'xw-w-[48px]'
};

export const DataSlider = forwardRef<HTMLInputElement, DataSliderProps>(
    (
        {
            id,
            name,
            value,
            onValueChange,
            min = 0,
            max = 100,
            step = 1,
            className,
            classNames = {},
            ariaLabelledby,
            ariaLabel,
            units,
            valueFormatter
        },
        ref
    ) => {
        const generatedId = useId();
        const effectiveId = id ?? name ?? generatedId;
        const displayValue = units
            ? <UnitValue value={value} units={units} formatter={valueFormatter} />
            : <FormattedValue value={value} formatter={valueFormatter} />;

        return (
            <HStack className={clsx(
                classNameBase.container,
                classNames.container || className || classNameDefault.container
            )}>
                <Slider.Root
                    ref={ref}
                    id={effectiveId}
                    name={name}
                    className={clsx(
                        classNameBase.root,
                        classNames.root || classNameDefault.root
                    )}
                    value={[value]}
                    min={min}
                    max={max}
                    step={step}
                    aria-labelledby={ariaLabelledby}
                    aria-label={ariaLabel}
                    onValueChange={(values) => onValueChange(values[0])}
                >
                    <Slider.Track
                        className={clsx(
                            classNameBase.track,
                            classNames.track || classNameDefault.track
                        )}
                    >
                        <Slider.Range
                            className={clsx(
                                classNameBase.range,
                                classNames.range || classNameDefault.range
                            )}
                        />
                    </Slider.Track>
                    <Slider.Thumb
                        aria-label={name}
                        className={clsx(
                            classNameBase.thumb,
                            classNames.thumb || classNameDefault.thumb
                        )}
                    />
                </Slider.Root>
                <div className={clsx(
                    classNameBase.label,
                    classNames.label || classNameDefault.label
                )}>
                    {displayValue}
                </div>
            </HStack>
        );
    }
);

DataSlider.displayName = 'DataSlider';
