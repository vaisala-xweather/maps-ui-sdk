import { CSSProperties } from 'react';
import { usePositionContext } from '@/providers/PositionProvider';
import { pixels } from '@/utils/css';
import { POSITION } from '@/constants/position';

export const usePositionStyles = () => {
    const { position, top, left, collisionPadding = 0 } = usePositionContext();

    const positionStyles: CSSProperties = {
        position,
        ...(top !== undefined && { top: pixels(top) }),
        ...(left !== undefined && { left: pixels(left) }),
        ...(position === POSITION.absolute || position === POSITION.fixed
            ? { maxWidth: `calc(100% - 2 * var(--offset-x, ${collisionPadding}))` }
            : {})
    };

    return positionStyles;
};
