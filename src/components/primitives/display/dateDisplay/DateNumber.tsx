import { format } from 'date-fns';
import clsx from 'clsx';

import { DateBase, DateBaseProps } from './DateBase';

export interface DateNumberProps extends Omit<DateBaseProps, 'children'> {
  className?: string;
}

export const DateNumber = ({
    className,
    ...rest
}: DateNumberProps) => (
    <DateBase {...rest}>
        {({ date }) => {
            const dateNumber = format(date, 'd');
            return <p className={clsx('xw-text-lg xw-text-slate-700', className)}>{dateNumber}</p>;
        }}
    </DateBase>
);
