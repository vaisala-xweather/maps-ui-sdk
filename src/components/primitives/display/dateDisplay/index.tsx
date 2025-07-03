import React from 'react';
import { DateProvider } from '@/providers/DateProvider';
import { DayShort } from './DayShort';
import { DateNumber } from './DateNumber';
import { Time } from './Time';

interface DateProps {
  value: Date | string | number;
  children?: React.ReactNode;
}

export const DateDisplay = ({
    value,
    children
}: DateProps) => (
    <DateProvider value={value}>
        {children}
    </DateProvider>
);

DateDisplay.DayShort = DayShort;
DateDisplay.Time = Time;
DateDisplay.DateNumber = DateNumber;
