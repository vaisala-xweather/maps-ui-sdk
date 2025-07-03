import { ReactNode } from 'react';
import { useLocationContext } from '@/providers/LocationProvider';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';
import { DataViewerLoadingFallback } from '@/components/compositions/dataViewer/DataViewerLoadingFallback';
import { ForecastView } from '@/mapsgl/dataViewer/dataViews/forecast/ForecastView';

export interface ForecastCardProps {
    className?: string;
    title?: string;
    children?: ReactNode;
}

export const ForecastCard = ({
    className,
    title = 'Forecast',
    children = <ForecastView />
}: ForecastCardProps) => {
    const { coordinatesString } = useLocationContext();

    return (
        <WeatherApiDataFetcher
            requests={[{
                endpoint: 'forecasts',
                params: {
                    filter: '1day',
                    p: coordinatesString
                }
            }, {
                endpoint: 'forecasts',
                params: {
                    filter: '3hr',
                    p: coordinatesString
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
                loadingFallback={<DataViewerLoadingFallback className="xw-min-h-[600px]" />}>
                <DataViewerCardDivider />
                {title && <DataViewerCardTitle>{title}</DataViewerCardTitle>}
                <DataViewerCardBody>
                    {children}
                </DataViewerCardBody>
            </DataViewerCard>
        </WeatherApiDataFetcher>
    );
};
