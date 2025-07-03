import { ReactNode } from 'react';

export interface PanelHeaderProps {
    children?: ReactNode,
    header: string | ReactNode,
    headerClassName?: string,
    containerClassName?: string
}

export const PanelHeader = ({
    children,
    header,
    headerClassName = 'xw-text-3xl',
    containerClassName = 'xw-flex xw-items-center xw-mb-5 xw-p-5'
}: PanelHeaderProps) => (
    <div className={containerClassName}>
        <h2 className={headerClassName}>{header}</h2>
        {children}
    </div>
);
