import { forwardRef } from 'react';
import { DataViewerDataWrapper } from './DataViewerDataWrapper';

export interface DataViewerCardProps {
    /** Content to render when dataValidator isn't passed, or when data is valid */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Function to validate data */
    dataValidator?: (data: unknown) => boolean;
    /** Component to show while loading */
    loadingFallback?: React.ReactElement;
}

export const DataViewerCard = ({
    children,
    dataValidator,
    className = 'xw-mb-2 xw-bg-white xw-p-4',
    loadingFallback
}: DataViewerCardProps) => (
    <DataViewerDataWrapper
        dataValidator={dataValidator}
        loadingFallback={loadingFallback}>
        <div className={className}>
            {children}
        </div>
    </DataViewerDataWrapper>
);

DataViewerCard.displayName = 'DataViewer.Card';
