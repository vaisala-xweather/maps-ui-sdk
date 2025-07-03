import { ReactNode } from 'react';
import clsx from 'clsx';
import { LoadingSpinner } from '@/components/primitives/animation/LoadingSpinner';
import { HStack } from '@/components/primitives/layout/Stack';

export interface DataViewerLoadingFallbackProps {
    children?: ReactNode;
    className?: string;
}

export const DataViewerLoadingFallback = ({
    className,
    children = <LoadingSpinner />
}: DataViewerLoadingFallbackProps) => (
    <HStack className={clsx('xw-items-center xw-justify-center', className)}>
        {children}
    </HStack>
);

DataViewerLoadingFallback.displayName = 'DataViewer.LoadingFallback';
