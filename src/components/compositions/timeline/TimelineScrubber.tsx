import { useEffect, useRef, MouseEvent, useState, useCallback } from 'react';
import { motion, useAnimation, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';
import { useTimelineContext } from '@/providers/TimelineProvider';

export type TimelineScrubberProps = Omit<HTMLMotionProps<'div'>, 'drag' | 'dragConstraints' | 'onDrag'>;

/**
 * Type guard to ensure position is a valid number within track bounds
 */
const isValidPosition = (
    position: number | undefined | null,
    trackWidth: number | undefined | null
): position is number => {
    if (typeof position !== 'number' || typeof trackWidth !== 'number') {
        return false;
    }

    return position >= 0 && position <= trackWidth;
};

export const TimelineScrubber = ({
    children,
    className,
    onClick,
    ...rest
}: TimelineScrubberProps) => {
    const {
        indicatorPosition,
        onDrag,
        dimensions,
        onPause,
        isResizing
    } = useTimelineContext();
    const controls = useAnimation();
    const isDraggingRef = useRef(false);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const lastDraggedPositionRef = useRef<number | null>(null);

    useEffect(() => {
        if (isValidPosition(indicatorPosition, dimensions?.trackWidth)) {
            if (!hasLoaded) {
                setHasLoaded(true);
            }
            controls.set({ x: indicatorPosition });
        } else {
            controls.set({ x: 0 });
        }
    }, [indicatorPosition, dimensions?.trackWidth, controls, hasLoaded]);

    const handleDrag = useCallback(() => {
        if (!indicatorRef.current?.offsetParent) return;

        const parentLeftPosition = indicatorRef.current.offsetParent.getBoundingClientRect().left;
        const indicatorLeftPosition = indicatorRef.current.getBoundingClientRect().left;

        if (typeof parentLeftPosition === 'number' && typeof indicatorLeftPosition === 'number') {
            const indicatorOffset = indicatorLeftPosition - parentLeftPosition;

            // Only call onDrag if the position has actually changed
            if (lastDraggedPositionRef.current !== indicatorOffset) {
                lastDraggedPositionRef.current = indicatorOffset;
                onDrag(indicatorOffset);
            }
        }
    }, [onDrag]);

    const handleDragStart = () => {
        isDraggingRef.current = true;
    };

    const handleDragEnd = () => {
        isDraggingRef.current = false;
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        onPause();
        onClick?.(event);
    };

    const shouldRenderChildren = isValidPosition(indicatorPosition, dimensions?.trackWidth)
        && hasLoaded
        && !isResizing;

    return (
        <motion.div
            ref={indicatorRef}
            className={clsx('xw-timeline-scrubber xw-absolute xw-cursor-pointer xw-z-20', className)}

            drag="x"
            dragConstraints={{
                left: 0,
                right: dimensions?.trackWidth ?? 0
            }}
            initial={false}
            animate={controls}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            dragMomentum={false}
            onClick={handleClick}
            {...rest}
        >
            {shouldRenderChildren && children}
        </motion.div>
    );
};

TimelineScrubber.displayName = 'Timeline.Scrubber';
