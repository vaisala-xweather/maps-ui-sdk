import { ReactNode } from 'react';
import clsx from 'clsx';

export interface PanelItemProps {
    children: ReactNode
    className?: string,
}

export const PanelItem = ({ children, className }: PanelItemProps) => (
    <div className={clsx('xw-flex xw-items-center', className)}>
        {children}
    </div>
);
