import { forwardRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

export type CenterXPositionerProps = ComponentPropsWithRef<'div'>;

export const CenterXPositioner = forwardRef<HTMLDivElement, CenterXPositionerProps>(({
    className,
    children,
    ...rest
}, ref) => (
    <div
        ref={ref}
        className={clsx('xw-transform xw--translate-x-1/2', className)}
        {...rest}
    >
        {children}
    </div>
));

CenterXPositioner.displayName = 'CenterXPositioner';
