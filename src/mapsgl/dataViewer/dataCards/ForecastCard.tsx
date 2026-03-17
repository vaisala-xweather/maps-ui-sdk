import { ReactNode } from 'react';
import { useLocationContext } from '@/providers/LocationProvider';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';
import { DataViewerLoadingFallback } from '@/components/compositions/dataViewer/DataViewerLoadingFallback';
import {
    ForecastDataView,
    ForecastIntervalConfig,
    ForecastMetricConfig,
    ForecastParamsByEndpoint
} from '@/types/forecast';
import { buildForecastRequests, resolveForecastIntervals } from '@/utils/forecast';
import { ForecastProvider } from '@/mapsgl/dataViewer/dataViews/forecast/ForecastProvider';
import { ForecastView } from '@/mapsgl/dataViewer/dataViews/forecast/ForecastView';

const DEFAULT_FORECAST_PARAMS_BY_ENDPOINT: ForecastParamsByEndpoint = {};

export interface ForecastCardProps {
    className?: string;
    title?: string;
    children?: ReactNode;
    /**
     * Endpoint-scoped request params applied to all requests for that endpoint.
     *
     * For forecast interval requests, `paramsByEndpoint.forecasts` overrides
     * per-interval defaults (`interval.params`). Use interval configs when you
     * need different values per interval. `filter` and `p` are always pinned
     * by the builder and cannot be overridden.
     */
    paramsByEndpoint?: ForecastParamsByEndpoint;
    intervals?: ForecastIntervalConfig[];
    metrics?: ForecastMetricConfig[];
    defaultIntervalId?: string;
    defaultDataView?: ForecastDataView;
    includeSunMoon?: boolean;
    includeOutlook?: boolean;
}

export const ForecastCard = ({
    className,
    title = 'Forecast',
    children,
    paramsByEndpoint = DEFAULT_FORECAST_PARAMS_BY_ENDPOINT,
    intervals: intervalsProp,
    metrics,
    defaultIntervalId,
    defaultDataView,
    includeSunMoon,
    includeOutlook = true
}: ForecastCardProps) => {
    const { coordinatesString } = useLocationContext();
    const intervals = resolveForecastIntervals(intervalsProp);

    const content = (
        <DataViewerCard
            className={className}
            loadingFallback={<DataViewerLoadingFallback className="xw-min-h-[600px]" />}
        >
            <DataViewerCardDivider />
            {title ? <DataViewerCardTitle>{title}</DataViewerCardTitle> : null}
            <DataViewerCardBody>
                <ForecastProvider
                    intervals={intervals}
                    metrics={metrics}
                    defaultIntervalId={defaultIntervalId}
                    defaultDataView={defaultDataView}
                    includeSunMoon={includeSunMoon}
                    includeOutlook={includeOutlook}
                >
                    {children ?? <ForecastView />}
                </ForecastProvider>
            </DataViewerCardBody>
        </DataViewerCard>
    );

    const requestParamsByEndpoint = paramsByEndpoint ?? DEFAULT_FORECAST_PARAMS_BY_ENDPOINT;

    return (
        <WeatherApiDataFetcher
            requests={buildForecastRequests({
                coordinatesString,
                intervals,
                paramsByEndpoint: requestParamsByEndpoint,
                includeSunMoon,
                includeOutlook
            })}
        >
            {content}
        </WeatherApiDataFetcher>
    );
};
