import { forwardRef, MouseEvent, useEffect, ReactNode, useRef } from 'react';
import clsx from 'clsx';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { HStack } from '@/components/primitives/layout/Stack';
import { useComposedRefs } from '@/hooks/useComposeRefs';

export interface TimelineTrackProps {
    children: ReactNode;
    className?: string;
}

export const TimelineTrack = forwardRef<HTMLDivElement, TimelineTrackProps>(({
    children,
    className
}, ref) => {
    const { onPositionChange, setDimensions } = useTimelineContext();
    const trackRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(ref, trackRef);

    useEffect(() => {
        if (!trackRef.current) return;

        const updateWidth = () => {
            const width = trackRef.current?.getBoundingClientRect().width;
            if (width) {
                setDimensions({ trackWidth: width });
            }
        };

        updateWidth();

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updateWidth);
        });

        resizeObserver.observe(trackRef.current);

        return () => {
            resizeObserver.disconnect();
            setDimensions({ trackWidth: null });
        };
    }, [setDimensions]);

    const handleTimelineClick = (event: MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        onPositionChange(x);
    };

    return (
        <HStack
            ref={composedRef}
            className={clsx(
                'xw-timeline-track xw-cursor-pointer xw-relative xw-w-full',
                className
            )}
            onClick={handleTimelineClick}
        >
            {children}
        </HStack>
    );
});

TimelineTrack.displayName = 'Timeline.Track';
