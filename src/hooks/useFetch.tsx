import { useState, useEffect } from 'react';
import { HttpResponseType } from '@/types/http';
import { RequestOptions } from '@/types/fetch';
import HttpError from '@/utils/error/http';
import NetworkError from '@/utils/error/network';
import { fetchData } from '@/utils/fetchData';

export interface UseFetchReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseFetchProps extends RequestOptions {
  responseType?: HttpResponseType;
}

export const useFetch = <T, >(url: string, options?: UseFetchProps): UseFetchReturn<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchDataEffect = async () => {
            setLoading(true);
            setError(null);

            try {
                const responseData = await fetchData<T>(url, options, controller.signal);
                if (!controller.signal.aborted) {
                    setData(responseData);
                }
            } catch (fetchError) {
                if (!controller.signal.aborted) {
                    if (fetchError instanceof HttpError) {
                        setError(fetchError);
                    } else if (fetchError instanceof NetworkError) {
                        setError(fetchError);
                    } else if (fetchError instanceof Error) {
                        setError(fetchError);
                    } else {
                        console.error('Unexpected error:', fetchError);
                    }
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchDataEffect();

        return () => {
            controller.abort();
        };
    }, [url, options]);

    return { data, loading, error };
};
