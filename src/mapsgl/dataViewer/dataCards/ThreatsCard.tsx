import { ReactNode } from 'react';
import { get } from '@aerisweather/javascript-utils';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { useLocationContext } from '@/providers/LocationProvider';
import { isEmpty } from '@/utils/object';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { ThreatsView } from '@/mapsgl/dataViewer/dataViews/ThreatsView';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';

export interface ThreatsCardProps {
    className?: string;
    params?: Record<string, string>;
    title?: string;
    children?: ReactNode;
    dataValidator?: (data: any) => boolean;
}

export const ThreatsCard = ({
    className,
    title = 'Threats',
    params = {},
    children = <ThreatsView />,
    dataValidator = (data) => !isEmpty(data) && get(data, '0.periods.0.storms')
}: ThreatsCardProps) => {
    const { coordinatesString } = useLocationContext();

    return (
        <WeatherApiDataFetcher
            endpoint="threats"
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
