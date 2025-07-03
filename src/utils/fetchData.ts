import { HttpResponseType, HttpMethod } from '@/types/http';
import { UseFetchProps } from '@/hooks/useFetch';
import HttpError from '@/utils/error/http';

export const fetchData = async <T>(
    url: string,
    options?: UseFetchProps,
    signal?: AbortSignal
): Promise<T> => {
    const requestOptions: RequestInit = {
        method: options?.method || HttpMethod.Get,
        headers: options?.headers || {},
        signal,
        body: (options?.method !== HttpMethod.Get && options?.method !== HttpMethod.Head)
            ? options?.body
            : undefined
    };
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        const contentType = response.headers.get('Content-Type') || '';
        const isJson = contentType.startsWith('application/json');

        let errorBody;

        try {
            errorBody = isJson ? await response.json() : await response.text();
        } catch (error_) {
            if (error_ instanceof Error) {
                errorBody = `Failed to parse response body: ${error_.message}`;
            }
        }

        throw new HttpError(response.status, errorBody);
    }

    const responseType = options?.responseType || HttpResponseType.Json;
    let responseData: T;

    switch (responseType) {
        case HttpResponseType.Json: {
            responseData = await response.json() as T;
            break;
        }
        case HttpResponseType.Text: {
            responseData = await response.text() as T;
            break;
        }
        case HttpResponseType.Blob: {
            responseData = await response.blob() as T;
            break;
        }
        default: {
            throw new Error('Invalid response type');
        }
    }

    return responseData;
};
