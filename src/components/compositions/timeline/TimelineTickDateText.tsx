import clsx from 'clsx';
import { TickData } from '@/types/timeline';
import { TimelineDateText, type TimelineDateTextProps } from './TimelineDateText';

export interface TimelineTickDateTextProps extends Omit<TimelineDateTextProps, 'date' | 'variant'> {
    /** The tick data object containing position and date information */
    tick: TickData;
}

/**
 * Renders a date label for a timeline tick mark.
 * Shows dates for the first tick and new days when sufficient space is available.
 */
export const TimelineTickDateText = ({
    tick,
    className,
    useRelative = true
}: TimelineTickDateTextProps) => {
    const isFirstTick = tick.index === 0;
    const firstTickIsNewDay = isFirstTick && tick.isNewDay;

    if ((!isFirstTick && !tick.isNewDay) || (!firstTickIsNewDay && tick.availableSpace <= 55)) {
        return null;
    }

    return (
        <div className="xw-timeline-tick-date-text xw-absolute xw-h-full" style={{
            left: isFirstTick && !tick.isNewDay ? 0 : tick.leftOffset
        }}>
            <TimelineDateText
                className={clsx('xw-absolute xw-ml-2 xw-whitespace-nowrap', className)}
                date={tick.date}
                useRelative={useRelative && (tick.availableSpace > 75 || firstTickIsNewDay)}
                variant="numeric"
            />
        </div>
    );
};

TimelineTickDateText.displayName = 'Timeline.TickDateText';
