import { ReactNode } from 'react';
import { ModalHeader } from '@/components/primitives/overlays/modal/ModalHeader';

export type DataViewerHeaderProps = {
    children: ReactNode;
    className?: string;
};

export const DataViewerHeader = ({
    children,
    className
}: DataViewerHeaderProps) => (
    <ModalHeader className={className}>
        {children}
    </ModalHeader>
);

DataViewerHeader.displayName = 'DataViewer.Header';
