import { ReactNode } from 'react';
import { useVisibilityContext } from '@/providers/VisibilityProvider';
import { Positioner } from '@/components/primitives/layout/Positioner';

export interface PopoverContentProps {
    children: ReactNode;
    className: string;
    isVisibleOverride?: boolean;
}

export const PopoverContent = ({
    children,
    isVisibleOverride,
    className
}: PopoverContentProps) => {
    const { isVisible } = useVisibilityContext();
    const visible = isVisibleOverride ?? isVisible;

    if (!visible) return null;

    return (
        <Positioner className={className}>
            {children}
        </Positioner>
    );
};
