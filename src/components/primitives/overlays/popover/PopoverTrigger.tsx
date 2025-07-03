import { ReactNode, RefObject } from 'react';
import clsx from 'clsx';
import { usePositionContext } from '@/providers/PositionProvider';
import { useVisibilityContext } from '@/providers/VisibilityProvider';
import { Button, ButtonProps } from '@/components/primitives/buttons/Button';

export interface PopoverTriggerProps extends Omit<ButtonProps, 'onClick'> {
    children?: ReactNode;
    onClick?: (isVisible: boolean) => void
}

export const PopoverTrigger = ({
    children,
    onClick,
    ...rest
}: PopoverTriggerProps) => {
    const { toggleVisibility, isVisible } = useVisibilityContext();
    const { triggerRef } = usePositionContext();

    const handleClick = () => {
        if (onClick) {
            onClick(!isVisible);
        } else {
            toggleVisibility();
        }
    };

    return (
        <Button
            {...rest}
            ref={triggerRef as RefObject<HTMLButtonElement>}
            className={clsx('popover-trigger', rest?.className)}
            onClick={handleClick}
        >
            {children}
        </Button>
    );
};
