import {
    createContext,
    useContext,
    ReactNode,
    forwardRef,
    type CSSProperties,
    type Ref,
    useMemo,
    useId,
    useCallback
} from 'react';
import clsx from 'clsx';
import { type KeyboardNavItem } from '@/hooks/useKeyboardNavigation';
import { useSelectableItem } from '@/hooks/useSelectableItem';
import { useSelectableCollection } from '@/hooks/useSelectableCollection';
import { useComposedRefs } from '@/hooks/useComposeRefs';
import { Slot } from '@/components/primitives/utils/Slot';
import { Button } from '@/components/primitives/buttons/Button';

interface RadioGroupContextProps {
    /** The currently selected value. */
    value?: string;
    /** Updates the currently selected value. */
    onValueChange: (value: string) => void;
    /** An optional name attribute for form integration. */
    name?: string;
    /** Register an item (with value and ref) for keyboard navigation. */
    registerItem: (item: KeyboardNavItem<string>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextProps | null>(null);

/**
 * Hook to access the RadioGroup context.
 * @returns The current RadioGroup context value.
 * @throws Error if used outside of RadioGroup.Root.
 */
const useRadioGroupContext = (): RadioGroupContextProps => {
    const context = useContext(RadioGroupContext);
    if (!context) {
        throw new Error('RadioGroup components must be used within RadioGroup.Root');
    }
    return context;
};

/**
 * Props for the RadioGroup root component.
 */
interface RadioGroupRootProps {
    /**
     * The currently selected value.
     * Can be undefined on mount but should always have a value after the first selection.
     * */
    value?: string;
    /** Optional id for the container element. */
    id?: string;
    /** Optional name attribute for form integration. */
    name?: string;
    /** Child elements (e.g. `RadioGroup.Item`). */
    children: ReactNode;
    /** Optional className for styling. */
    className?: string;
    /** Optional inline styles. */
    style?: CSSProperties;
    /** Accessible label for the radio group. */
    ariaLabel?: string;
    /** Accessible label reference for the radio group. */
    ariaLabelledby?: string;
    /** Forwarded ref to the container element. */
    ref?: Ref<HTMLDivElement>;
    /** Callback fired when selection changes. */
    onValueChange: (value: string) => void;
}

/**
 * `RadioGroup.Root`
 *
 * The parent container that manages keyboard navigation and selection state for a group of radios.
 * It:
 * - Registers items as they mount via `registerItem`.
 * - Uses `useKeyboardNavigation` to manage arrow key navigation and selection.
 * - Provides a context so `RadioGroup.Item` can access `value` and `onValueChange`.
 *
 * - Items register themselves with the parent, avoiding fragile DOM queries.
 */
const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupRootProps>(({
    value,
    onValueChange,
    id,
    name,
    children,
    className = 'xw-w-full',
    style,
    ariaLabel,
    ariaLabelledby
}, ref) => {
    const { onKeyDown, registerItem } = useSelectableCollection<string>({
        role: 'radio',
        value: value ?? null, // Convert undefined to null for internal handling
        onValueChange: (newValue: string | null) => {
            // Only call onValueChange with string values
            if (newValue !== null) {
                onValueChange(newValue);
            }
        }
    });

    return (
        <RadioGroupContext.Provider
            value={{
                value,
                onValueChange,
                name,
                registerItem
            }}
        >
            <div
                ref={ref}
                id={id}
                role="radiogroup"
                aria-labelledby={ariaLabelledby}
                aria-label={ariaLabel}
                className={clsx(
                    'xw-radio-group-root',
                    className
                )}
                style={style}
                onKeyDown={onKeyDown}
            >
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
});

RadioGroupRoot.displayName = 'RadioGroup.Root';

/**
 * Props for the `RadioGroup.Item` component.
 */
interface RadioGroupItemProps {
    /** Unique value associated with this radio item. */
    value: string;
    /** Child content for the radio item (e.g. label text). */
    children: ReactNode;
    /** If true, renders the child component with inherited props instead of the default element. */
    asChild?: boolean;
    /** Optional custom id. */
    id?: string;
    /** Optional custom className. */
    className?: string;
    /** If true, this radio item is disabled. */
    disabled?: boolean;
    /** Forwarded ref. */
    ref?: Ref<HTMLButtonElement>;
}

/**
 * `RadioGroup.Item`
 *
 * Represents an individual radio option.
 * Registers itself with the parent `RadioGroup.Root` for keyboard navigation.
 * Handles click to select itself.
 *
 * Uses `Slot` to merge props if `asChild` is true, allowing flexible rendering while maintaining good accessibility.
 */
const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(({
    value: itemValue,
    children,
    asChild = false,
    className,
    disabled,
    id,
    ...rest
}, ref) => {
    const generatedId = useId();
    const effectiveId = id ?? generatedId;
    const { value, onValueChange, name, registerItem } = useRadioGroupContext();
    const isChecked = itemValue === value;

    const handleValueChange = useCallback((newValue: string) => {
        // For radio buttons, we only want to handle selection, not deselection
        if (newValue !== value) {
            onValueChange(newValue);
        }
    }, [onValueChange, value]);

    const { refCallback, handleClick } = useSelectableItem({
        value: itemValue,
        disabled,
        isSelected: isChecked,
        onValueChange: handleValueChange,
        registerItem
    });

    // Compose refCallback and ref so parent can also access the node
    const composedRef = useComposedRefs(refCallback, ref);

    const Component = asChild ? Slot : Button;

    const props = useMemo(() => ({
        'id': effectiveId,
        name,
        'role': 'radio' as const,
        'aria-checked': isChecked,
        'data-value': itemValue,
        'value': itemValue,
        'data-state': isChecked ? 'checked' : 'unchecked',
        disabled,
        'tabIndex': disabled || !isChecked ? -1 : 0,
        'onClick': handleClick,
        'className': clsx(
            'xw-radio-group-item',
            className ?? 'xw-text-xs xw-px-2 xw-py-1 xw-rounded xw-border-[1px] xw-border-slate-500'
        ),
        ...rest
    }), [effectiveId, name, isChecked, itemValue, disabled, className, handleClick, rest]);

    return (
        <Component
            {...props}
            ref={composedRef}
        >
            {children}
        </Component>
    );
});

RadioGroupItem.displayName = 'RadioGroup.Item';

type RadioGroupProps = RadioGroupRootProps;

const RadioGroup = ({ children, ...rest }: RadioGroupProps) => (
    <RadioGroupRoot {...rest}>{children}</RadioGroupRoot>
);
RadioGroup.displayName = 'RadioGroup';

RadioGroup.Root = RadioGroupRoot;
RadioGroup.Item = RadioGroupItem;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

// Compound Component
export { RadioGroup, type RadioGroupProps };

// Context
export { RadioGroupContext, useRadioGroupContext, type RadioGroupContextProps };

// Sub-components
export { RadioGroupRoot, type RadioGroupRootProps };
export { RadioGroupItem, type RadioGroupItemProps };
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
