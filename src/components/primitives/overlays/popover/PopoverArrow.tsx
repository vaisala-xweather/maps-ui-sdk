import { usePositionContext } from '@/providers/PositionProvider';
import { pixels } from '@/utils/css';
import { SIDE } from '@/constants/position';
import { useEffect, useState, useCallback } from 'react';
import { useDimensions } from '@/hooks/useDimensions';

export interface PopoverArrowProps {
    size?: number;
}

export const PopoverArrow = ({ size = 10 }) => {
    const { side, triggerRef, contentElement } = usePositionContext();
    const [arrowStyles, setArrowStyles] = useState({ left: '0', top: '0' });

    const { dimensions: triggerDimensions } = useDimensions(triggerRef?.current ?? undefined, true);
    const { dimensions: contentDimensions } = useDimensions(contentElement ?? undefined, true);

    const updateArrowPosition = useCallback(() => {
        if (!triggerDimensions || !contentDimensions) return;

        let newStyles = {
            left: '0',
            top: '0'
        };

        switch (side) {
            case SIDE.top: {
                newStyles = {
                    top: pixels(contentDimensions.bottom),
                    left: pixels(triggerDimensions.left + triggerDimensions.width / 2)
                };
                break;
            }
            case SIDE.bottom: {
                newStyles = {
                    top: pixels(contentDimensions.top - size),
                    left: pixels(triggerDimensions.left + triggerDimensions.width / 2)
                };
                break;
            }
            case SIDE.left: {
                newStyles = {
                    left: pixels(contentDimensions.right),
                    top: pixels(triggerDimensions.top + triggerDimensions.height / 2)
                };
                break;
            }
            case SIDE.right: {
                newStyles = {
                    left: pixels(contentDimensions.left - size),
                    top: pixels(triggerDimensions.top + triggerDimensions.height / 2)
                };
                break;
            }
            default: {
                break;
            }
        }

        setArrowStyles(newStyles);
    }, [side, triggerDimensions, contentDimensions, size]);

    useEffect(() => {
        updateArrowPosition();
    }, [updateArrowPosition]);

    if (!triggerDimensions || !contentDimensions) return null;

    return (
        <div
            className="xw-popover-arrow xw-fixed"
            style={{
                width: pixels(size),
                height: pixels(size),
                background: 'inherit',
                transform: 'translateY(-50%) translateX(-50%) rotate(45deg)',
                ...arrowStyles
            }}
        />
    );
};
