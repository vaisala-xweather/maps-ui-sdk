import { forwardRef, useCallback, useRef, ComponentPropsWithRef } from 'react';
import clsx from 'clsx';
import { usePositionContext } from '@/providers/PositionProvider';
import { usePositionStyles } from '@/hooks/usePositionStyles';

export type PositionerProps = ComponentPropsWithRef<'div'>;

export const Positioner = forwardRef<HTMLDivElement, PositionerProps>(({
    children,
    className = '',
    style = {},
    ...rest
}, ref) => {
    const { position, setContentElement } = usePositionContext();
    const positionStyles = usePositionStyles();
    const nodeRef = useRef<HTMLDivElement | null>(null);

    const handleRef = useCallback((node: HTMLDivElement | null) => {
        nodeRef.current = node;
        if (typeof ref === 'function') {
            ref(node);
        } else if (ref) {
            ref.current = node;
        }
        setContentElement(node);
    }, [ref, setContentElement]);

    return (
        <div
            ref={handleRef}
            className={clsx(position, className)}
            style={{
                ...style,
                ...positionStyles
            }}
            {...rest}
        >
            {children}
        </div>
    );
});
Positioner.displayName = 'Positioner';
