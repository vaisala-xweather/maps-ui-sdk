import { forwardRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { HStack } from '@/components/primitives/layout/Stack';

export interface TimelineTrackContainerProps {
    children: ReactNode;
    className?: string;
}

export const TimelineTrackContainer = forwardRef<HTMLDivElement, TimelineTrackContainerProps>(({
    children,
    className
}, ref) => (
    <HStack
        ref={ref}
        className={clsx(
            'xw-timeline-track-container xw-flex xw-h-full xw-w-full',
            className
        )}
    >
        {children}
    </HStack>
));

TimelineTrackContainer.displayName = 'Timeline.TrackContainer';
