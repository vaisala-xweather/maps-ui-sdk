import { Fragment, ReactNode } from 'react';
import { TickData } from '@/types/timeline';
import { useTicks, UseTicksProps } from './useTicks';

export interface TimelineTicksProps extends UseTicksProps {
    /**
     * Render function called for each tick mark on the timeline.
     * @param tick Contains position and time information for this tick mark
     */
    children: (tick: TickData) => ReactNode;
}

export const TimelineTicks = ({
    children,
    minSpacing,
    density
}: TimelineTicksProps) => {
    const ticks = useTicks({ minSpacing, density });

    if (!ticks?.length) return null;

    return (
        ticks.map((tick) => (
            <Fragment key={tick.leftOffset}>
                {children(tick)}
            </Fragment>
        ))
    );
};

TimelineTicks.displayName = 'Timeline.Ticks';
