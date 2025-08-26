import { forwardRef, isValidElement } from 'react';
import clsx from 'clsx';
import { Slot } from '@/components/primitives/utils/Slot';
import { Button, ButtonProps } from '@/components/primitives/buttons/Button';

export interface ToggleProps extends ButtonProps {
    /** The current pressed state of the toggle. */
    pressed?: boolean;
    /** If true, renders the child component with inherited props instead of the default element. */
    asChild?: boolean;
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({
    pressed = false,
    children,
    asChild = false,
    className,
    ...props
}, ref) => {
    const toggleProps = {
        ref,
        'role': 'button',
        'data-state': pressed ? 'on' : 'off',
        'aria-pressed': pressed,
        'className': clsx('xw-toggle', className),
        ...props
    };

    const Component = asChild ? Slot : Button;

    return (
        <Component {...toggleProps}>
            {children}
        </Component>
    );
});

Toggle.displayName = 'Toggle';
