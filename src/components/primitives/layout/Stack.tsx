import { forwardRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

export interface StackProps extends ComponentPropsWithRef<'div'> {
  orientation?: 'horizontal' | 'vertical';
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(({
    className = '',
    children,
    orientation,
    ...rest
}, ref) => (
    <div

        ref={ref}
        className={clsx('xw-flex', orientation === 'vertical' && 'xw-flex-col', className)}
        {...rest}
    >
        {children}
    </div>
));

Stack.displayName = 'Stack';

export type HStackProps = Omit<StackProps, 'orientation'>;

export const HStack = forwardRef<HTMLDivElement, HStackProps>(({ children, ...rest }, ref) => (
    <Stack orientation="horizontal" {...rest} ref={ref}>
        {children}
    </Stack>
));

HStack.displayName = 'HStack';

export type VStackProps = Omit<StackProps, 'orientation'>;

export const VStack = forwardRef<HTMLDivElement, VStackProps>(({ children, ...rest }, ref) => (
    <Stack orientation="vertical" {...rest} ref={ref}>
        {children}
    </Stack>
));

VStack.displayName = 'VStack';
