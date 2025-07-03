import {
    format,
    isToday,
    isTomorrow,
    isYesterday
} from 'date-fns';
import { DATE_TIME_FORMATS } from '@/constants/time';
import { useTimelineContext } from '@/providers/TimelineProvider';
import { DateFormatVariant } from '@/types/time';
import { ComponentPropsWithRef, forwardRef } from 'react';

export interface TimelineDateTextProps extends ComponentPropsWithRef<'p'> {
    date?: Date;
    variant?: DateFormatVariant;
    useRelative?: boolean;
}

const getFormattedDate = (
    date: Date,
    variant: DateFormatVariant,
    useRelative: boolean
): string => {
    if (useRelative) {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        if (isYesterday(date)) return 'Yesterday';
    }

    const formatString = {
        numeric: DATE_TIME_FORMATS.dateNumeric,
        short: DATE_TIME_FORMATS.dateShort,
        long: DATE_TIME_FORMATS.dateLong
    }[variant];

    return format(date, formatString);
};

export const TimelineDateText = forwardRef<HTMLParagraphElement, TimelineDateTextProps>(({
    date,
    variant = 'short',
    useRelative = false,
    ...rest
}, ref) => {
    const { currentDate } = useTimelineContext();
    const effectiveDate = date ?? currentDate;

    if (!effectiveDate) return null;

    const formattedText = getFormattedDate(effectiveDate, variant, useRelative);

    return (
        <p ref={ref} {...rest}>{formattedText}</p>
    );
});

TimelineDateText.displayName = 'Timeline.DateText';
