import { forwardRef, ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import { dataAttribute } from '@/utils/dom';

export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    label?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    type = 'button',
    children,
    className,
    disabled,
    label,
    onClick,
    ...rest
}, ref) => (
    <button
        ref={ref}
        type={type}
        className={clsx(
            'xw-transition-opacity',
            disabled ? 'xw-opacity-50 xw-cursor-not-allowed' : 'xw-cursor-pointer',
            className
        )}
        disabled={disabled}
        data-disabled={dataAttribute(disabled)}
        onClick={disabled ? undefined : onClick}
        {...rest}
    >
        {children || label}
    </button>
));

Button.displayName = 'Button';
