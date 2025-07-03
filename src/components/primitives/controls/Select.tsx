import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef, ComponentPropsWithoutRef, useId } from 'react';
import clsx from 'clsx';
import { normalizeOptions } from '@/utils/control';
import { Option } from '@/types/control';
import { DownArrowIcon } from '@/components/compositions/icons/Icon';

export interface SelectProps extends Omit<ComponentPropsWithoutRef<typeof SelectPrimitive.Root>, 'className'> {
    /** Optional id for the select */
    id?: string;
    /** Optional name for form submission */
    name?: string;
    /** Current value of the select */
    value: string;
    /** Array of options to display */
    options: Option[] | string[];
    /** Optional className for styling the trigger */
    className?: string;
    /** Optional classNames for granular styling of select components */
    classNames?: {
        trigger?: string;
        content?: string;
        viewport?: string;
        item?: string;
        itemText?: string;
        icon?: string;
    };
    /** Optional aria-labelledby attribute for accessibility */
    ariaLabelledby?: string;
    /** Callback when selection changes */
    onValueChange: (value: string) => void;
}

const classNameBase = {
    trigger: 'xw-select-trigger xw-flex xw-items-center xw-justify-between xw-cursor-pointer',
    content: 'xw-select-content',
    viewport: 'xw-select-viewport',
    item: 'xw-select-item xw-relative xw-flex xw-items-center xw-w-full xw-cursor-pointer',
    itemText: 'xw-select-item-text ',
    icon: 'xw-select-icon'
};

const classNameDefault = {
    trigger: 'xw-bg-transparent xw-border-0 xw-text-base hover:xw-opacity-80',
    content: 'xw-bg-slate-900 xw-rounded xw-p-1 xw-shadow-lg xw-z-50',
    viewport: '',
    item: `xw-pl-3 xw-pr-8 xw-py-2 xw-text-white hover:xw-bg-slate-800 
    data-[highlighted]:xw-outline-none data-[highlighted]:xw-bg-slate-800`,
    itemText: '',
    icon: 'xw-ml-2'
};

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
    (
        {
            id,
            name,
            options,
            value,
            className,
            classNames = {},
            ariaLabelledby,
            onValueChange,
            ...rest
        },
        ref
    ) => {
        const generatedId = useId();
        const effectiveId = id ?? name ?? generatedId;
        const normalizedOptions = normalizeOptions(options);
        const selectedOption = normalizedOptions.find((opt) => opt.value === value);

        return (
            <SelectPrimitive.Root
                value={value}
                onValueChange={onValueChange}
                {...rest}
            >
                <SelectPrimitive.Trigger
                    ref={ref}
                    id={effectiveId}
                    name={name ?? effectiveId}
                    className={clsx(
                        classNameBase.trigger,
                        classNames.trigger || className || classNameDefault.trigger
                    )}
                    aria-labelledby={ariaLabelledby}
                >
                    <SelectPrimitive.Value placeholder={selectedOption?.label || 'Select an option'} />
                    <SelectPrimitive.Icon
                        className={clsx(classNameBase.icon, classNames.icon || classNameDefault.icon)}>
                        <DownArrowIcon />
                    </SelectPrimitive.Icon>
                </SelectPrimitive.Trigger>

                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={5}
                    className={clsx(
                        classNameBase.content,
                        classNames.content || classNameDefault.content
                    )}
                >
                    <SelectPrimitive.Viewport
                        className={clsx(
                            classNameBase.viewport,
                            classNames.viewport || classNameDefault.viewport
                        )}
                    >
                        {normalizedOptions.map((option) => (
                            <SelectPrimitive.Item
                                key={option.value}
                                value={option.value}
                                className={clsx(
                                    classNameBase.item,
                                    classNames.item || classNameDefault.item
                                )}
                            >
                                <SelectPrimitive.ItemText
                                    className={clsx(
                                        classNameBase.itemText,
                                        classNames.itemText || classNameDefault.itemText
                                    )}
                                >
                                    {option.label}
                                </SelectPrimitive.ItemText>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Root>
        );
    }
);

Select.displayName = 'Select';
