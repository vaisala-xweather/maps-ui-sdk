import { ReactNode } from 'react';
import { useLocationContext } from '@/providers/LocationProvider';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';
import { DataViewerLoadingFallback } from '@/components/compositions/dataViewer/DataViewerLoadingFallback';
import { Conditions } from '@/mapsgl/dataViewer/dataViews/conditions';

export interface ConditionsCardProps {
    className?: string;
    title?: string;
    children?: ReactNode;
    params?: Record<string, string>;
}

export const ConditionsCard = ({
    className,
    title = 'Latest Conditions',
    children = (
        <Conditions.Provider>
            <Conditions.View />
            <Conditions.Table />
        </Conditions.Provider>
    ),
    params = {}
}: ConditionsCardProps) => {
    const { coordinatesString } = useLocationContext();

    return (
        <WeatherApiDataFetcher
            endpoint="conditions"
            params={{
                p: coordinatesString,
                ...params
            }}>
            <DataViewerCard
                className={className}
                loadingFallback={<DataViewerLoadingFallback className="xw-min-h-[350px]"/>}>
                <DataViewerCardDivider />
                {title && <DataViewerCardTitle>{title}</DataViewerCardTitle>}
                <DataViewerCardBody>
                    {children}
                </DataViewerCardBody>
            </DataViewerCard>
        </WeatherApiDataFetcher>
    );
};
