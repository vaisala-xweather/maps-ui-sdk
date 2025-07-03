import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { usePositionContext } from '@/providers/PositionProvider';
import { Side } from '@/types/position';
import { SIDE } from '@/constants/position';

export interface SlideProps extends HTMLMotionProps<'div'> {
    duration?: number;
    delay?: number;
    side?: Side;
    offset?: number;
}

const getSlideDirection = (
    effectiveSide: Side | undefined,
    effectiveOffsetX: number,
    effectiveOffsetY: number
) => {
    switch (effectiveSide) {
        case SIDE.top: { return { y: effectiveOffsetY };
        }
        case SIDE.bottom: { return { y: -effectiveOffsetY };
        }
        case SIDE.left: { return { x: effectiveOffsetX };
        }
        case SIDE.right: { return { x: -effectiveOffsetX };
        }
        default: { return { y: 0 };
        }
    }
};

export const Slide = forwardRef<HTMLDivElement, SlideProps>(({
    children,
    duration = 0.2,
    side,
    offset = 12,
    delay = 0,
    transition,
    animate = 'visible',
    ...rest
}, ref) => {
    const {
        side: contextSide,
        offsetY: contextOffsetY,
        offsetX: contextOffsetX
    } = usePositionContext();
    const effectiveSide = side ?? contextSide;
    const effectiveOffsetX = contextOffsetX ?? offset;
    const effectiveOffsetY = contextOffsetY ?? offset;

    const slideDirection = getSlideDirection(effectiveSide, effectiveOffsetX, effectiveOffsetY);

    const variants = {
        hidden: {
            opacity: 0,
            ...slideDirection,
            pointerEvents: 'none' as const
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            pointerEvents: 'auto' as const
        },
        exit: {
            opacity: 0,
            ...slideDirection
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={animate}
            exit="exit"
            variants={variants}
            transition={{ duration, delay, ...transition }}
            {...rest}
        >
            {children}
        </motion.div>
    );
});

Slide.displayName = 'Slide';
