import clsx from 'clsx';
import { TickData } from '@/types/timeline';
import { CenterXPositioner } from '@/components/primitives/layout/CenterXPositioner';

export interface TimelineTickProps {
    tick: TickData;
    className?: string;
}

export const TimelineTick = ({
    tick,
    className
}: TimelineTickProps) => (
    <CenterXPositioner
        style={{
            left: tick.leftOffset
        }}
        className={clsx(
            'xw-timeline-tick xw-absolute',
            tick.isNewDay ? 'xw-tick-new-day xw-h-full' : 'xw-opacity-25',
            className
        )}
    />
);

TimelineTick.displayName = 'Timeline.Tick';
