import { ReactNode } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { RequestOptions } from '@/types/fetch';

interface DataFetcherProps {
  url: string;
  requestOptions: RequestOptions;
  children: ({ data, loading, error }: { data: any; loading: boolean; error: Error | null }) => ReactNode;
}

export const DataFetcher = ({
    url,
    requestOptions,
    children
}: DataFetcherProps) => {
    const { data, loading, error } = useFetch(url, requestOptions);
    return (
        children({ data, loading, error })
    );
};
export default DataFetcher;
