import { createContext, useContext, useMemo, ReactNode } from 'react';
import { isValid, parseISO } from 'date-fns';
import { getTimeZoneFromDateTimeISO } from '@/utils/date';

interface DateContextValue {
  date: Date;
  timeZone: string | null;
}

export const DateContext = createContext<DateContextValue | undefined>(undefined);

export const useDateContext = () => {
    const context = useContext(DateContext);
    if (!context) {
        throw new Error('useDateContext must be used within a DateProvider');
    }
    return context;
};

interface DateProviderProps {
  value: Date | string | number;
  children: ReactNode;
}

export const DateProvider = ({
    value,
    children
}: DateProviderProps) => {
    let date: Date;
    let timeZone: string | null = null;

    if (typeof value === 'string') {
        date = parseISO(value);
        timeZone = getTimeZoneFromDateTimeISO(value);
    } else if (typeof value === 'number') {
        date = new Date(value);
    } else {
        date = value;
    }

    if (!isValid(date)) {
        throw new Error('Invalid date value provided to DateProvider');
    }

    const contextValue = useMemo(() => ({ date, timeZone }), [date.getTime(), timeZone]);

    return <DateContext.Provider value={contextValue}>{children}</DateContext.Provider>;
};
