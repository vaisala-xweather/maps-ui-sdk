import { format, isToday } from 'date-fns';
import clsx from 'clsx';

import { DateBase, DateBaseProps } from './DateBase';

export interface DayShortProps extends Omit<DateBaseProps, 'children'> {
  className?: string;
}

export const DayShort = ({
    className,
    ...rest
}: DayShortProps) => (
    <DateBase {...rest}>
        {({ date }) => {
            const dayDisplay = isToday(date) ? 'Today' : format(date, 'EEE');
            return <p className={clsx('xw-text-slate-500', className)}>{dayDisplay}</p>;
        }}
    </DateBase>
);
