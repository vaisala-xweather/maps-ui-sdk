import { useCallback, CSSProperties } from 'react';
import { usePositionContext } from '@/providers/PositionProvider';
import { usePositionStyles } from '@/hooks/usePositionStyles';

export const usePositioner = () => {
    const { setContentElement } = usePositionContext();
    const positionStyles: CSSProperties = usePositionStyles();

    const getPositionerProps = useCallback(() => ({
        ref: setContentElement,
        style: positionStyles
    }), [positionStyles, setContentElement]);

    return {
        getPositionerProps,
        positionStyles,
        setContentElement
    };
};
