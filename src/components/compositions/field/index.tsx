import {
    createContext,
    useContext,
    ReactNode,
    forwardRef,
    useId,
    Ref,
    RefAttributes,
    ForwardRefExoticComponent
} from 'react';
import clsx from 'clsx';
import { Control } from '@/components/compositions/control';
import { Slot } from '@/components/primitives/utils/Slot';
import type { ControlProps } from '@/types/control';
import { Stack } from '@/components/primitives/layout/Stack';

interface BaseFieldProps {
    /** Text label for the field */
    label?: string;
    /** Custom CSS classes */
    className?: string;
}

type FieldRootProps = ControlProps &
    BaseFieldProps & {
        children: ReactNode;
        orientation?: 'horizontal' | 'vertical';
    };

type FieldContextValue = BaseFieldProps & Omit<ControlProps, 'id'> & {
    id: string;
    labelId: string;
};

const FieldContext = createContext<FieldContextValue | null>(null);

const useFieldContext = (): FieldContextValue => {
    const context = useContext(FieldContext);
    if (!context) {
        throw new Error('Field components must be used within Field.Root');
    }
    return context;
};

type FieldProviderProps = BaseFieldProps & ControlProps & {
    children: ReactNode;
};

/**
 * `Field.Provider`
 *
 * Provider component that manages field context. Can be used for custom
 * field implementations that need access to field context.
 * Generates a unique ID for the field if not provided and creates a labelId for the field.
 */
const FieldProvider = ({
    label,
    children,
    id,
    name,
    ...controlProps
}: FieldProviderProps) => {
    const generatedId = useId();
    const effectiveId = id ?? name ?? generatedId;
    const labelId = `${effectiveId}-label`;

    return (
        <FieldContext.Provider
            value={{
                id: effectiveId,
                name,
                labelId,
                label,
                ...controlProps
            }}
        >
            {children}
        </FieldContext.Provider>
    );
};

/**
 * `Field.Root`
 *
 * Root container component for Field. Provides context and layout structure for field components.
 */
const FieldRoot = forwardRef<HTMLDivElement, FieldRootProps>(
    ({
        children,
        orientation = 'horizontal',
        className,
        label,
        ...rest
    }, ref) => (
        <FieldProvider label={label} {...(rest as ControlProps)}>
            <Stack
                ref={ref}
                orientation={orientation}
                className={clsx(
                    'xw-w-full',
                    className,
                    orientation === 'horizontal' && 'xw-justify-between'
                )}
            >
                {children}
            </Stack>
        </FieldProvider>
    )
);
FieldRoot.displayName = 'Field.Root';

/**
 * `Field.Label`
 *
 * Label component for Field. Automatically connected to its control via aria-labelledby.
 */
interface FieldLabelProps {
    children?: ReactNode;
    className?: string;
}

const FieldLabel = forwardRef<HTMLLabelElement | HTMLDivElement, FieldLabelProps>(
    ({
        children,
        className = 'xw-py-1'
    }, ref) => {
        const { labelId, label } = useFieldContext();

        return (
            <div
                ref={ref as Ref<HTMLDivElement>}
                id={labelId}
                className={clsx(className)}
            >
                {children ?? label}
            </div>
        );
    }
);

FieldLabel.displayName = 'Field.Label';

/**
 * `Field.Control`
 *
 * A component that either renders a `Control` or a child component.
 */

interface FieldControlProps {
    /** If true, renders the child component with inherited props instead of the default element. */
    asChild?: boolean;
    children?: ReactNode;
    className?: string;
}

const FieldControl = forwardRef<HTMLElement, FieldControlProps>(({
    asChild,
    children,
    className
}, ref) => {
    const { labelId, id, name, ...controlProps } = useFieldContext();

    const baseProps = {
        ref,
        ariaLabelledby: labelId,
        id,
        name: name ?? id,
        className
    };

    if (asChild && children) {
        return <Slot {...baseProps}>{children}</Slot>;
    }

    return <Control {...baseProps} {...(controlProps as ControlProps)} />;
});

FieldControl.displayName = 'Field.Control';

/**
 * `Field`
 *
 * A compound component that provides a consistent way to render fields with labels and controls.
 * Manages control context, accessibility connections, and layout structure.
 *
 * Note: This component does not have built in form integration but could be used as a base for a form field component.
 */
type FieldProps = FieldRootProps;

type FieldComponent = ForwardRefExoticComponent<FieldProps & RefAttributes<HTMLDivElement>> & {
    Root: typeof FieldRoot;
    Provider: typeof FieldProvider;
    Label: typeof FieldLabel;
    Control: typeof FieldControl;
};

const Field = forwardRef<HTMLDivElement, FieldProps>(
    ({ children, ...rest }, ref) => (
        <Field.Root ref={ref} {...rest}>
            {children}
        </Field.Root>
    )
) as FieldComponent;

Field.displayName = 'Field';

Field.Root = FieldRoot;
Field.Provider = FieldProvider;
Field.Label = FieldLabel;
Field.Control = FieldControl;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
export { Field, type FieldProps, type FieldComponent };

// Context
export { FieldContext, useFieldContext, type FieldContextValue };

// Sub-components
export { FieldRoot, type FieldRootProps };
export { FieldProvider, type FieldProviderProps };
export { FieldLabel, type FieldLabelProps };
export { FieldControl, type FieldControlProps };
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
