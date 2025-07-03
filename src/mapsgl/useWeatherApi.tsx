import { useMemo } from 'react';
import { WeatherApiEndpoint, WeatherApiConfig } from '@/types/weatherApi';
import { useMapsGLMapControllerContext } from '@/mapsgl/MapsGLMapControllerProvider';
import { useFetch } from '@/hooks/useFetch';

export type UseWeatherApiRequest = {
  [K in WeatherApiEndpoint]: {
    endpoint: WeatherApiConfig[K]['endpoint'];
    action?: WeatherApiConfig[K]['actions'][number];
    params?: Record<string, any>;
  };
}[WeatherApiEndpoint];

export type UseWeatherApiProps = Partial<UseWeatherApiRequest> & {
  requests?: UseWeatherApiRequest[];
};

const defaultRequestOptionsByEndpoint = {
    forecasts: {
        params: {
            filter: '1day',
            limit: 7
        }
    },
    alerts: {
        params: {
            fields: 'details.type,details.name,details.color,timestamps,'
        }
    },
    threats: {
        params: {
            radius: '50mi'
        }
    }
} as const;

export const useWeatherApi = ({
    endpoint,
    action,
    params = {},
    requests
}: UseWeatherApiProps) => {
    const { controller } = useMapsGLMapControllerContext();

    const getRequestWithMergedParams = (request: UseWeatherApiRequest) => {
        const mergedParams = (request.endpoint && request.endpoint in defaultRequestOptionsByEndpoint)
            ? {
                ...defaultRequestOptionsByEndpoint[
                    request.endpoint as keyof typeof defaultRequestOptionsByEndpoint
                ].params,
                ...request.params
            }
            : request.params;

        const apiWithEndpoint = controller.account.api().endpoint(request.endpoint);
        return request.action
            ? apiWithEndpoint.action(request.action as any).setParams(mergedParams as any)
            : apiWithEndpoint.setParams(mergedParams as any);
    };

    const apiRequest = useMemo(() => {
        if (requests?.length) {
            const batchRequestController = controller.account.api();
            requests.forEach((request) => {
                batchRequestController.addRequest(getRequestWithMergedParams(request));
            });
            return batchRequestController;
        }
        return getRequestWithMergedParams({ endpoint, action, params } as UseWeatherApiRequest);

        /* eslint-disable react-hooks/exhaustive-deps */
    }, [controller, endpoint, action, params, requests]);

    const url = apiRequest.url();

    return useFetch<any>(url);
};
