import { get } from '@aerisweather/javascript-utils';
import {
    WeatherApiDataFetcher,
    DataViewer,
    PlacesView,
    AlertsCard,
    ImpactsCard,
    ThreatsCard,
    ForecastCard,
    useLocationContext
} from '@xweather/maps-ui-sdk';
import { CustomConditionsCard } from './CustomConditionsCard';

export const LocalWeatherViewer = () => {
    const { coordinatesString } = useLocationContext();

    if (!coordinatesString) {
        return null;
    }

    return (
        <DataViewer
            className="w-full shadow-md bg-slate-100 rounded-xl sm:w-[360px]
                    min-h-[400px] max-h-[55vh] sm:max-h-[88vh] text-xs">
            <DataViewer.Header className="p-2 sm:p-4">
                <DataViewer.Title>
                    Local Weather
                </DataViewer.Title>
                <DataViewer.CloseButton className="ml-auto bg-slate-200 w-7 h-7 rounded-full"/>
            </DataViewer.Header>
            <DataViewer.Banner className="px-2 pb-2 sm:px-4 sm:pb-4">
                <WeatherApiDataFetcher
                    endpoint="places"
                    params={{
                        p: coordinatesString
                    }}
                >
                    <PlacesView />
                </WeatherApiDataFetcher>
            </DataViewer.Banner>

            <DataViewer.Body className="min-h-[400px] sm:max-h-[900px]">
                <AlertsCard />
                <ThreatsCard />
                <ImpactsCard
                    dataValidator={(data) => {
                        const impacts = get(data, '0.periods.0.impacts');
                        return Array.isArray(impacts) && impacts.length > 0;
                    }}
                    minimumSeverity={1}
                />
                <CustomConditionsCard />
                <ForecastCard />
            </DataViewer.Body>
        </DataViewer>
    );
};
