import clsx from 'clsx';
import { Hr, HrProps } from '@/components/primitives/layout/Hr';

export type DividerProps = HrProps;

export const Divider = ({ className }: HrProps) => (
    <Hr className={clsx('xw-opacity-20', className)} />
);
