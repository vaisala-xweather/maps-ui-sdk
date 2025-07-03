import { ReactNode } from 'react';
import clsx from 'clsx';
import { ModalBody } from '@/components/primitives/overlays/modal/ModalBody';

export type DataViewerBodyProps = {
    children: ReactNode;
    className?: string;
};

export const DataViewerBody = ({
    children,
    className
}: DataViewerBodyProps) => (
    <ModalBody
        className={clsx(
            'xw-min-w-full',
            className
        )}
    >
        {children}
    </ModalBody>
);

DataViewerBody.displayName = 'DataViewer.Body';
