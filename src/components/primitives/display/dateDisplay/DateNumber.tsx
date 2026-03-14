import clsx from 'clsx';
import { formatDate } from '@/utils/date';

import { DateBase, DateBaseProps } from './DateBase';

export interface DateNumberProps extends Omit<DateBaseProps, 'children'> {
  className?: string;
}

export const DateNumber = ({
    className,
    ...rest
}: DateNumberProps) => (
    <DateBase {...rest}>
        {({ date, timeZone }) => {
            const dateNumber = formatDate(date, 'd', timeZone) ?? '';
            return <p className={clsx('xw-text-lg xw-text-slate-700', className)}>{dateNumber}</p>;
        }}
    </DateBase>
);
