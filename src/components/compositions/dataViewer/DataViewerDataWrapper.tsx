import { ReactNode, ReactElement } from 'react';
import { SuspenseWrapper } from '@/components/data/api/SuspenseWrapper';
import { useDataContext } from '@/providers/DataProvider';

export interface DataViewerDataWrapperProps {
    /** Content to render when dataValidator isn't passed, or when data is valid */
    children: ReactNode;
    /** Component to show while loading */
    loadingFallback?: ReactElement;
    /** Function to validate data */
    dataValidator?: (data: unknown) => boolean;
}

export const DataViewerDataWrapper = ({
    children,
    dataValidator,
    loadingFallback = <></>
}: DataViewerDataWrapperProps) => {
    const { data, loading } = useDataContext();
    return (
        (dataValidator ? dataValidator(data) : true)
        && <SuspenseWrapper fallback={loadingFallback}>
            {data && !loading && children}
        </SuspenseWrapper>
    );
};

export default DataViewerDataWrapper;

DataViewerDataWrapper.displayName = 'DataViewer.DataWrapper';
