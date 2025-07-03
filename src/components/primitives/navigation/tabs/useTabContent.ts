import { CSSProperties } from 'react';
import clsx from 'clsx';
import { useDataContext } from '@/providers/DataProvider';
import { usePositioner } from '@/hooks/usePositioner';
import { POSITION } from '@/constants/position';
import { useTabsContext } from './TabsProvider';

export const useTabContent = (value: string, className: string, unmountOnExit?: boolean) => {
    const { currentTab, unmountOnExit: contextUnmountOnExit } = useTabsContext();
    const { position } = useDataContext();
    const { getPositionerProps } = usePositioner();
    const { style: baseStyle, ref } = getPositionerProps();
    const isVisible = currentTab === value;
    const effectivePosition = position ?? POSITION.relative;
    const effectiveUnmountOnExit = unmountOnExit ?? contextUnmountOnExit ?? false;

    const contentClasses = clsx(
        'xw-flex xw-flex-col xw-flex-grow',
        className
    );

    const style: CSSProperties = {
        ...baseStyle,
        display: (isVisible || (effectivePosition === POSITION.fixed || effectivePosition === POSITION.absolute))
            ? undefined
            : 'none'
    };

    return {
        isVisible,
        effectiveUnmountOnExit,
        style,
        ref,
        contentClasses,
        position
    };
};
