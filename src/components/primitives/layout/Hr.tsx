import { HTMLAttributes } from 'react';

export interface HrProps extends HTMLAttributes<HTMLHRElement> {
    className?: string;
}

export const Hr = ({ className = 'xw-border-slate-200', ...props }: HrProps) => (
    <hr className={className} {...props} />
);
