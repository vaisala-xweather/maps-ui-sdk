import { ReactNode } from 'react';
import { WeatherApiDataFetcher } from '@/components/data/api/WeatherApiDataFetcher';
import { useLocationContext } from '@/providers/LocationProvider';
import { DataViewerCard } from '@/components/compositions/dataViewer/DataViewerCard';
import { ImpactsView } from '@/mapsgl/dataViewer/dataViews/impacts/ImpactsView';
import { DataViewerCardTitle } from '@/components/compositions/dataViewer/DataViewerCardTitle';
import { DataViewerCardBody } from '@/components/compositions/dataViewer/DataViewerCardBody';
import { DataViewerCardDivider } from '@/components/compositions/dataViewer/DataViewerCardDivider';
import { DataViewerLoadingFallback } from '@/components/compositions/dataViewer/DataViewerLoadingFallback';
import { IMPACT_ACTIVITIES } from '@/constants/weatherApi/config';

export interface ImpactsCardProps {
    className?: string;
    title?: string;
    children?: ReactNode;
    minimumSeverity?: 0 | 1 | 2 | 3 | 4 | 5;
    activity?: typeof IMPACT_ACTIVITIES[number];
    dataValidator?: (data: any) => boolean;
}

export const ImpactsCard = ({
    className,
    title = 'Impacts',
    activity = 'general',
    minimumSeverity = 0,
    children = <ImpactsView />,
    dataValidator
}: ImpactsCardProps) => {
    const { coordinatesString } = useLocationContext();

    return (
        <WeatherApiDataFetcher
            endpoint={`impacts/${activity}`}
            params={{
                p: coordinatesString,
                filter: `minseverity${minimumSeverity}`
            }}>
            <DataViewerCard
                className={className}
                dataValidator={dataValidator}
                loadingFallback={<DataViewerLoadingFallback className="xw-min-h-[250px]"/>}>
                <DataViewerCardDivider />
                {title && <DataViewerCardTitle>{title}</DataViewerCardTitle>}
                <DataViewerCardBody>
                    {children}
                </DataViewerCardBody>
            </DataViewerCard>
        </WeatherApiDataFetcher>
    );
};
