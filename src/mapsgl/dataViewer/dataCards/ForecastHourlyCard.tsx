import { ReactNode } from 'react';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { useLocationContext } from '@/providers/LocationProvider';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';
import { DataViewerLoadingFallback } from '@/components/compositions/dataViewer/DataViewerLoadingFallback';
import { ForecastHourlyView } from '@/mapsgl/dataViewer/dataViews/forecast/ForecastHourlyView';

export interface ForecastHourlyCardProps {
    className?: string;
    title?: string;
    children?: ReactNode;
    params?: Record<string, string>;
}

export const ForecastHourlyCard = ({
    title = 'Hourly Forecast',
    children = <ForecastHourlyView />,
    params = {},
    className
}: ForecastHourlyCardProps) => {
    const { coordinatesString } = useLocationContext();

    return (
        <WeatherApiDataFetcher
            requests={[{
                endpoint: 'forecasts',
                params: {
                    filter: '3hr',
                    p: coordinatesString,
                    ...params
                }
            }, {
                endpoint: 'sunmoon',
                params: {
                    p: coordinatesString,
                    from: 'now',
                    to: '+1week'
                }
            }]}>
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
