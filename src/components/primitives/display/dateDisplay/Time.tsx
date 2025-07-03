import clsx from 'clsx';
import { formatDate } from '@/utils/date';
import { DateBase, DateBaseProps } from './DateBase';

export interface TimeProps extends Omit<DateBaseProps, 'children'> {
  className?: string;
}

export const Time = ({
    className,
    ...rest
}: TimeProps) => (
    <DateBase {...rest}>
        {({ date }) => {
            const timeDisplay = formatDate(date, 'h a')?.toLowerCase();
            return <p className={clsx('xw-text-base xw-text-slate-700', className)}>{timeDisplay}</p>;
        }}
    </DateBase>
);
