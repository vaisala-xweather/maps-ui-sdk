import { createContext, useContext, ReactNode } from 'react';
import { isValid, parseISO } from 'date-fns';

interface DateContextValue {
  date: Date;
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

    if (typeof value === 'string') {
        date = parseISO(value);
    } else if (typeof value === 'number') {
        date = new Date(value);
    } else {
        date = value;
    }

    if (!isValid(date)) {
        throw new Error('Invalid date value provided to DateProvider');
    }

    const contextValue = { date };

    return <DateContext.Provider value={contextValue}>{children}</DateContext.Provider>;
};
