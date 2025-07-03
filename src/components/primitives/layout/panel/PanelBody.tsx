import { ReactNode } from 'react';

export interface PanelBodyProps {
    children: ReactNode
    className?: string
}

export const PanelBody = ({ children, className = '' }: PanelBodyProps) => (
    <div className={className}>
        {children}
    </div>
);
