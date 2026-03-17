import clsx from 'clsx';
import { formatDate, isDateToday } from '@/utils/date';

import { DateBase, DateBaseProps } from './DateBase';

export interface DayShortProps extends Omit<DateBaseProps, 'children'> {
  className?: string;
}

export const DayShort = ({
    className,
    ...rest
}: DayShortProps) => (
    <DateBase {...rest}>
        {({ date, timeZone }) => {
            const dayDisplay = isDateToday(date, timeZone)
                ? 'Today'
                : (formatDate(date, 'EEE', timeZone) ?? '');
            return <p className={clsx('xw-text-slate-500', className)}>{dayDisplay}</p>;
        }}
    </DateBase>
);
