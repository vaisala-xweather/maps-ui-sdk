import {
    createContext,
    useContext,
    ReactNode,
    forwardRef,
    type CSSProperties,
    type Ref,
    useId,
    useCallback
} from 'react';
import clsx from 'clsx';
import { type KeyboardNavItem } from '@/hooks/useKeyboardNavigation';
import { type ToggleGroupSelectionProps } from '@/types/control';
import { type Nullable } from '@/types/utils';
import { useSelectableCollection } from '@/hooks/useSelectableCollection';
import { useSelectableItem } from '@/hooks/useSelectableItem';
import { useComposedRefs } from '@/hooks/useComposeRefs';
import { Slot } from '@/components/primitives/utils/Slot';
import { Button } from '../buttons/Button';

type ToggleGroupContextProps = ToggleGroupSelectionProps & {
    name?: string;
    registerItem: (item: KeyboardNavItem<string>) => void;
};

const ToggleGroupContext = createContext<ToggleGroupContextProps | null>(null);

/**
 * Hook to access the ToggleGroup context.
 * @returns The current ToggleGroup context value.
 * @throws Error if used outside of ToggleGroup.Root.
 */
const useToggleGroupContext = (): ToggleGroupContextProps => {
    const context = useContext(ToggleGroupContext);
    if (!context) {
        throw new Error('ToggleGroup components must be used within ToggleGroup.Root');
    }
    return context as ToggleGroupContextProps;
};

/**
 * Props for the `ToggleGroup.Root` component.
 */
type ToggleGroupRootProps = {
    /** Unique identifier for the toggle group. */
    id?: string;

    /** Optional name attribute for form integration. */
    name?: string;

    /** Child components, typically `ToggleGroup.Item`. */
    children: ReactNode;

    /** Optional CSS class name for styling. */
    className?: string;

    /** Optional inline styles. */
    style?: CSSProperties;

    /** Accessible label for the toggle group. */
    ariaLabel?: string;

    /** Accessible label reference for the toggle group. */
    ariaLabelledby?: string;

    /** Ref for the toggle group root element */
    ref?: Ref<HTMLDivElement>;
} & ToggleGroupSelectionProps;

/**
 * Creates a properly typed context value for the ToggleGroup based on the multiSelect mode.
 *
 * @param multiSelect - Whether multiple values can be selected
 * @param value - The current selected value(s)
 * @param onValueChange - Callback for selection changes
 * @param name - The name attribute for the toggle group
 * @param registerItem - Callback for registering items for keyboard navigation
 * @returns A context value matching the ToggleGroupContextProps type
 */
const createContextValue = (
    multiSelect: boolean,
    value: ToggleGroupRootProps['value'],
    onValueChange: ToggleGroupRootProps['onValueChange'],
    name: ToggleGroupRootProps['name'],
    registerItem: (item: KeyboardNavItem<string>) => void
): ToggleGroupContextProps => {
    if (multiSelect) {
        return {
            registerItem,
            multiSelect: true,
            value: value as string[],
            onValueChange: onValueChange as (value: string[]) => void,
            name
        };
    }
    return {
        registerItem,
        multiSelect: false,
        value: value as Nullable<string>,
        onValueChange: onValueChange as (value: Nullable<string>) => void,
        name
    };
};

/**
 * ToggleGroupRoot
 *
 * Provides a container for ToggleGroup items. The `multiSelect` prop determines
 * if multiple selections are allowed. The `value` and `onValueChange` props adjust their
 * types accordingly.
 */
const ToggleGroupRoot = forwardRef<HTMLDivElement, ToggleGroupRootProps>(({
    id,
    name,
    value,
    onValueChange,
    multiSelect = false,
    children,
    className = 'xw-w-full',
    style,
    ariaLabel,
    ariaLabelledby
}, ref) => {
    const { onKeyDown, registerItem } = useSelectableCollection<string, boolean>({
        role: 'button',
        value: multiSelect ? (value as string[]) : (value as string | null),
        onValueChange: multiSelect
            ? (onValueChange as (values: string[]) => void)
            : (onValueChange as (value: string | null) => void),
        multiSelect,
        requireSelection: false
    });
    const contextValue = createContextValue(multiSelect, value, onValueChange, name, registerItem);

    return (
        <ToggleGroupContext.Provider value={contextValue}>
            <div
                ref={ref}
                id={id}
                role="group"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledby}
                className={clsx(
                    'xw-toggle-group-root',
                    className
                )}
                style={style}
                onKeyDown={onKeyDown}
            >
                {children}
            </div>
        </ToggleGroupContext.Provider>
    );
});

ToggleGroupRoot.displayName = 'ToggleGroup.Root';

interface ToggleGroupItemProps {
    /** Optional unique identifier for the toggle group item. If not provided, a generated ID will be used. */
    id?: string;
    /** The value associated with this toggle button. */
    value: string;
    /** Child components or content. */
    children: ReactNode;
    /** If true, renders the child component with inherited props instead of the default element. */
    asChild?: boolean;
    /** Optional CSS class name for styling. */
    className?: string;
    /** If true, disables the toggle button. */
    disabled?: boolean;
    /** Ref for the toggle group item element */
    ref?: Ref<HTMLButtonElement>;
}

/**
 * ToggleGroupItem
 *
 * Represents a toggleable button. If `multiSelect` is true, selections accumulate
 * in an array. If false, only a single value can be selected. Pressing a selected
 * single-value item deselects it by passing `null` to `onValueChange`.
 */
const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(({
    value,
    children,
    asChild = false,
    className,
    disabled,
    id,
    ...rest
}, ref) => {
    const generatedId = useId();
    const effectiveId = id ?? generatedId;
    const { multiSelect, value: groupValue, onValueChange, name, registerItem } = useToggleGroupContext();

    const isSelected = multiSelect
        ? groupValue?.includes(value)
        : groupValue === value;

    const handleValueChange = useCallback((newValue: string) => {
        if (multiSelect) {
            const currentValues = (groupValue as string[]) ?? [];
            const newValues = currentValues.includes(newValue)
                ? currentValues.filter((v) => v !== newValue)
                : [...currentValues, newValue];
            (onValueChange as (values: string[]) => void)(newValues);
        } else {
            (onValueChange as (value: string | null) => void)(
                groupValue === newValue ? null : newValue
            );
        }
    }, [multiSelect, groupValue, onValueChange]);

    const { refCallback, handleClick } = useSelectableItem<string>({
        value,
        disabled,
        isSelected: !!isSelected,
        onValueChange: handleValueChange,
        registerItem
    });

    // Compose refCallback and ref so parent can also access the node
    const composedRef = useComposedRefs(refCallback, ref);

    const Component = asChild ? Slot : Button;

    const props = {
        'id': effectiveId,
        name,
        'role': 'button' as const,
        'aria-pressed': isSelected,
        'data-state': isSelected ? 'on' : 'off',
        'data-value': value,
        disabled,
        'tabIndex': disabled || !isSelected ? -1 : 0,
        'onClick': handleClick,
        'className': clsx(
            'xw-toggle-group-item',
            className ?? 'xw-text-xs xw-px-2 xw-py-1 xw-rounded xw-border-[1px] xw-border-slate-500 xw-gap-2'
        ),
        ...rest
    };

    return (
        <Component
            {...props}
            ref={composedRef}
        >
            {children}
        </Component>
    );
});

ToggleGroupItem.displayName = 'ToggleGroup.Item';

type ToggleGroupProps = ToggleGroupRootProps;

const ToggleGroup = ({ children, ...rest }: ToggleGroupProps) => (
    <ToggleGroupRoot {...rest}>{children}</ToggleGroupRoot>
);

ToggleGroup.displayName = 'ToggleGroup';

ToggleGroup.Root = ToggleGroupRoot;
ToggleGroup.Item = ToggleGroupItem;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */

// Compound Component
export { ToggleGroup, type ToggleGroupProps };

// Context
export { ToggleGroupContext, useToggleGroupContext, type ToggleGroupContextProps };

// Sub-components
export { ToggleGroupRoot, type ToggleGroupRootProps };
export { ToggleGroupItem, type ToggleGroupItemProps };
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
