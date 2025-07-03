import { forwardRef } from 'react';
import clsx from 'clsx';
import { type StackProps, Stack } from '@xweather/maps-ui-sdk';

export interface BoxProps extends StackProps {
    variant?: 'default' | 'dark' | 'light';
    size?: 'sm' | 'md' | 'lg';
}

const BOX_STYLES = {
    base: 'gap-1 rounded-xl',
    variants: {
        default: 'bg-slate-100 text-slate-900',
        dark: 'bg-black text-white',
        light: 'bg-white text-black'
    },
    sizes: {
        sm: 'p-1.5',
        md: 'p-2',
        lg: 'p-4'
    }
} as const;

export const Box = forwardRef<HTMLDivElement, BoxProps>(({
    className = '',
    children,
    orientation,
    variant = 'dark',
    size = 'md',
    ...rest
}, ref) => {
    const effectiveClassName = clsx(
        BOX_STYLES.base,
        BOX_STYLES.variants[variant],
        BOX_STYLES.sizes[size],
        className
    );

    return (
        <Stack
            ref={ref}
            className={effectiveClassName}
            orientation={orientation}
            {...rest}
        >
            {children}
        </Stack>
    );
});

Box.displayName = 'Box';
