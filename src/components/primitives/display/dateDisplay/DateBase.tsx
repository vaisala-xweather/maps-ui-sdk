import { ReactNode } from 'react';
import { useDateContext } from '@/providers/DateProvider';

export interface DateBaseProps {
  date?: Date;
  children: ({ date }: {date: Date;}) => ReactNode;
}

export const DateBase = ({
    date,
    children
}: DateBaseProps) => {
    const { date: contextDate } = useDateContext();

    return children({ date: date || contextDate });
};
