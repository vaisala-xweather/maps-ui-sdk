import { ReactNode } from 'react';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { useLocationContext } from '@/providers/LocationProvider';
import { isEmpty } from '@/utils/object';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { AlertsView } from '@/mapsgl/dataViewer/dataViews/AlertsView';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';

export interface AlertsCardProps {
    className?: string;
    params?: Record<string, string>;
    title?: string;
    children?: ReactNode;
    dataValidator?: (data: any) => boolean;
}

export const AlertsCard = ({
    className,
    title = 'Active Alerts',
    params = {},
    children = <AlertsView />,
    dataValidator = (data: any) => !isEmpty(data)
}: AlertsCardProps) => {
    const { coordinatesString } = useLocationContext();

    return (
        <WeatherApiDataFetcher
            endpoint="alerts"
            params={{
                p: coordinatesString,
                radius: '50mi',
                ...params
            }}>
            <DataViewerCard
                className={className}
                dataValidator={dataValidator}>
                <DataViewerCardDivider />
                {title && <DataViewerCardTitle>{title}</DataViewerCardTitle>}
                <DataViewerCardBody>
                    {children}
                </DataViewerCardBody>
            </DataViewerCard>
        </WeatherApiDataFetcher>
    );
};
