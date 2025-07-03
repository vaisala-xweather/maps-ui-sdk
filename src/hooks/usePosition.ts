import { useMemo } from 'react';
import { Side, Align } from '@/types/position';
import { ALIGN, SIDE } from '@/constants/position';

const adjustWithinBounds = (
    value: number,
    max: number,
    size: number,
    collisionPadding = 0
) => {
    if (value < collisionPadding) return collisionPadding;
    if (value + size > max - collisionPadding) return max - size - collisionPadding;
    return value;
};

const calculateTopPosition = (
    side: Side,
    triggerRect: DOMRect,
    contentRect: DOMRect,
    offsetY: number
) => {
    let top = triggerRect.top + window.scrollY;

    if (side === SIDE.top) {
        top -= contentRect.height;
        top -= offsetY;
    } else if (side === SIDE.bottom) {
        top += triggerRect.height;
        top += offsetY;
    }

    return top;
};

const calculateLeftPosition = (
    side: Side,
    triggerRect: DOMRect,
    contentRect: DOMRect,
    offsetX: number
) => {
    let left = triggerRect.left + window.scrollX;
    if (side === SIDE.left) {
        left -= contentRect.width;
        left -= offsetX;
    } else if (side === SIDE.right) {
        left += triggerRect.width;
        left += offsetX;
    }
    return left;
};

const applyAlignmentAdjustment = (
    align: Align,
    side: Side,
    triggerRect: DOMRect,
    contentRect: DOMRect,
    top: number,
    left: number
) => {
    if (align === ALIGN.center) {
        if (side === SIDE.top || side === SIDE.bottom) {
            left += (triggerRect.width - contentRect.width) / 2;
        } else {
            top += (triggerRect.height - contentRect.height) / 2;
        }
    } else if (align === ALIGN.end) {
        if (side === SIDE.top || side === SIDE.bottom) {
            left += triggerRect.width - contentRect.width;
        } else {
            top += triggerRect.height - contentRect.height;
        }
    }

    return { top, left };
};

const calculatePosition = (
    side: Side,
    align: Align,
    offsetX: number,
    offsetY: number,
    triggerRect: DOMRect,
    contentRect: DOMRect,
    collisionPadding = 0
) => {
    let top = calculateTopPosition(side, triggerRect, contentRect, offsetY);
    let left = calculateLeftPosition(side, triggerRect, contentRect, offsetX);

    ({ top, left } = applyAlignmentAdjustment(align, side, triggerRect, contentRect, top, left));

    top = adjustWithinBounds(top, window.innerHeight, contentRect.height, collisionPadding);
    left = adjustWithinBounds(left, window.innerWidth, contentRect.width, collisionPadding);

    return { top, left };
};

export interface UsePositionProps {
    side: Side | undefined;
    align: Align | undefined;
    offsetX: number;
    offsetY: number;
    triggerDimensions: DOMRect | null;
    contentElement: HTMLElement | null;
    collisionPadding: number;
}

export const usePosition = ({
    side,
    align = ALIGN.start,
    offsetX,
    offsetY,
    triggerDimensions,
    contentElement,
    collisionPadding = 0
}: UsePositionProps) => {
    const calculatedPosition = useMemo(() => {
        if (triggerDimensions && contentElement && side) {
            const contentRect = contentElement.getBoundingClientRect();
            return calculatePosition(
                side,
                align,
                offsetX,
                offsetY,
                triggerDimensions,
                contentRect,
                collisionPadding
            );
        }
        return { top: undefined, left: undefined };
    }, [
        side,
        align,
        offsetX,
        offsetY,
        triggerDimensions,
        contentElement,
        collisionPadding
    ]);

    return calculatedPosition;
};
