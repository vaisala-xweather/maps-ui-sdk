import { ReactNode } from 'react';
import { useDateContext } from '@/providers/DateProvider';

export interface DateRenderProps {
    date: Date;
    timeZone: string | null;
}

export interface DateBaseProps {
  date?: Date;
  children: (props: DateRenderProps) => ReactNode;
}

export const DateBase = ({
    date,
    children
}: DateBaseProps) => {
    const { date: contextDate, timeZone } = useDateContext();

    return children({ date: date || contextDate, timeZone });
};
