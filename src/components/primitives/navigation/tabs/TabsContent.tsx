import { ReactNode, CSSProperties } from 'react';
import clsx from 'clsx';
import { Positioner } from '@/components/primitives/layout/Positioner';
import { POSITION } from '@/constants/position';
import { useTabContent } from './useTabContent';

export interface TabsContentProps {
    children: ReactNode;
    value: string;
    className?: string;
    unmountOnExit?: boolean;
}

export const TabsContent = ({
    children,
    value,
    className = '',
    unmountOnExit
}: TabsContentProps) => {
    const {
        isVisible,
        effectiveUnmountOnExit,
        style: baseStyle,
        ref,
        contentClasses,
        position
    } = useTabContent(value, className, unmountOnExit);

    const style: CSSProperties = {
        ...baseStyle,
        visibility: !isVisible && (position === POSITION.fixed || position === POSITION.absolute)
            ? 'hidden'
            : 'visible'
    };

    return (
        (!effectiveUnmountOnExit || isVisible) && (
            <Positioner
                className={clsx(contentClasses)}
                ref={ref}
                style={style}
            >
                {children}
            </Positioner>
        )
    );
};

TabsContent.displayName = 'Tabs.Content';
