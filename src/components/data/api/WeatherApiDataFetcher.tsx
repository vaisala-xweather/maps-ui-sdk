import { ReactNode } from 'react';
import { useWeatherApi, UseWeatherApiProps } from '@/mapsgl/useWeatherApi';
import { DataProvider } from '@/providers/DataProvider';

export type WeatherApiDataFetcherProps = UseWeatherApiProps & {
  children: ReactNode;
  onData?: () => void;
  onError?: (error: Error) => void;
};

export const WeatherApiDataFetcher = ({
    endpoint,
    action,
    params,
    requests,
    children
}: WeatherApiDataFetcherProps) => {
    const { data, loading, error } = useWeatherApi({
        endpoint,
        action,
        params,
        requests
    } as UseWeatherApiProps);

    return (
        <DataProvider data={{
            data: data?.response?.responses ?? (data?.response ?? null),
            loading,
            error
        }}>
            {children}
        </DataProvider>
    );
};
