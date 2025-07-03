import clsx from 'clsx';
import { format } from 'date-fns';
import { DATE_TIME_FORMATS } from '@/constants/time';
import { useTimelineContext } from '@/providers/TimelineProvider';

export interface TimelineTimeTextProps {
    date?: Date;
    className?: string;
    hour12?: boolean;
}

export const TimelineTimeText = ({
    date,
    className,
    hour12 = true
}: TimelineTimeTextProps) => {
    const { currentDate } = useTimelineContext();
    const effectiveDate = date ?? currentDate;

    if (!effectiveDate) return null;

    const formatString = hour12
        ? DATE_TIME_FORMATS.time12
        : DATE_TIME_FORMATS.time24;

    const formattedText = format(effectiveDate, formatString);

    return (
        <p className={clsx('xw-timeline-time-text', className)}>{formattedText}</p>
    );
};
