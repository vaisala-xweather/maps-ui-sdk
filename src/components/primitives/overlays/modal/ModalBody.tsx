import { forwardRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

export type ModalBodyProps = ComponentPropsWithRef<'div'>;

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(({
    children,
    className = 'p-4',
    ...rest
}, ref) => (
    <div
        ref={ref}
        className={clsx('xw-min-w-full xw-w-full xw-overflow-y-auto xw-h-auto', className)}
        {...rest}
    >
        {children}
    </div>
));

ModalBody.displayName = 'Modal.Body';
