import { format } from 'date-fns';

export const formatDate = (date: Date, formatStr: string): string | null => {
    if (typeof formatStr !== 'string' || formatStr.trim().length === 0) {
        console.warn(`Cannot format date with invalid format string "${formatStr}". Refer to the supported format options at https://date-fns.org/docs/format`);
        return null;
    }
    return format(date, formatStr);
};

export const getTimeZoneFromDateTimeISO = (dateTimeISO: string) => dateTimeISO.slice(-6);
