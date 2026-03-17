import { format, isToday } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const ISO_TIME_ZONE_REGEX = /(Z|[+-]\d{2}:\d{2}|[+-]\d{4})$/;
const COMPACT_OFFSET_REGEX = /^[+-]\d{4}$/;

const normalizeTimeZoneOffset = (offset: string): string => (
    COMPACT_OFFSET_REGEX.test(offset)
        ? `${offset.slice(0, 3)}:${offset.slice(3)}`
        : offset
);

/** Formats in `timeZone` when provided; falls back to local timezone on invalid input. */
export const formatDate = (
    date: Date,
    formatStr: string,
    timeZone?: string | null
): string | null => {
    if (typeof formatStr !== 'string' || formatStr.trim().length === 0) {
        console.warn(`Cannot format date with invalid format string "${formatStr}". Refer to the supported format options at https://date-fns.org/docs/format`);
        return null;
    }

    try {
        return timeZone
            ? formatInTimeZone(date, timeZone, formatStr)
            : format(date, formatStr);
    } catch (error) {
        console.warn(`Cannot format date with invalid timezone "${timeZone}". Falling back to local timezone.`, error);
        return format(date, formatStr);
    }
};

/** Compares calendar dates in `timeZone` when provided; falls back to local timezone. */
export const isDateToday = (date: Date, timeZone?: string | null): boolean => {
    if (!timeZone) {
        return isToday(date);
    }

    try {
        return formatInTimeZone(date, timeZone, 'yyyy-MM-dd')
            === formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd');
    } catch {
        return isToday(date);
    }
};

/** Returns a normalized UTC offset (e.g. `"+02:00"`, `"UTC"`) or `null` if the string contains no offset. */
export const getTimeZoneFromDateTimeISO = (dateTimeISO: string): string | null => {
    const match = dateTimeISO.match(ISO_TIME_ZONE_REGEX)?.[1] ?? null;

    if (!match) return null;
    if (match === 'Z') return 'UTC';

    return normalizeTimeZoneOffset(match);
};
