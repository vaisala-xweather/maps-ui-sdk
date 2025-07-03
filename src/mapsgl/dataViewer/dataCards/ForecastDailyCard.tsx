import { ReactNode } from 'react';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { useLocationContext } from '@/providers/LocationProvider';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';
import { DataViewerLoadingFallback } from '@/components/compositions/dataViewer/DataViewerLoadingFallback';
import { ForecastDailyView } from '@/mapsgl/dataViewer/dataViews/forecast/ForecastDailyView';

export interface ForecastDailyCardProps {
    className?: string;
    title?: string;
    children?: ReactNode;
    params?: Record<string, string>;
}

export const ForecastDailyCard = ({
    className,
    title = 'Daily Forecast',
    children = <ForecastDailyView />,
    params = {}
}: ForecastDailyCardProps) => {
    const { coordinatesString } = useLocationContext();

    return (
        <WeatherApiDataFetcher
            endpoint="forecasts"
            params={{
                p: coordinatesString,
                filter: '1day',
                ...params
            }}>
            <DataViewerCard
                className={className}
                loadingFallback={<DataViewerLoadingFallback className="xw-min-h-[200px]" />}>
                <DataViewerCardDivider />
                {title && <DataViewerCardTitle>{title}</DataViewerCardTitle>}
                <DataViewerCardBody>
                    {children}
                </DataViewerCardBody>
            </DataViewerCard>
        </WeatherApiDataFetcher>
    );
};
