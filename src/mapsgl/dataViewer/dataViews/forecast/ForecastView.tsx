import { useState } from 'react';
import { Select } from '@/components/primitives/controls/Select';
import { Tabs } from '@/components/primitives/navigation/tabs';
import { TabsProvider, TabsContext } from '@/components/primitives/navigation/tabs/TabsProvider';
import { useDataContext, DataProvider } from '@/providers/DataProvider';
import { DataView } from '@/types/forecast';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { ForecastHourlyTable } from './ForecastHourlyTable';
import { ForecastDailyTable } from './ForecastDailyTable';
import { ForecastBaseView } from './ForecastBaseView';

const DATA_CONTROL_OPTIONS = [{
    label: 'Daily',
    value: 'daily'
}, {
    label: 'Hourly',
    value: 'hourly'
}];

export const ForecastView = () => {
    const { data } = useDataContext();
    const [forecastDailyData, forecastHourlyData, sunMoonData] = data;
    const [dataView, setDataView] = useState<DataView>(DATA_VIEW_CONFIG.temperature.id);

    const forecastTypeControl = <TabsContext.Consumer>
        {({ currentTab, setCurrentTab }) => (
            <Select
                name="data-control"
                className="xw-border-0 xw-text-base"
                value={currentTab ?? ''}
                options={DATA_CONTROL_OPTIONS}
                onValueChange={(view) => setCurrentTab(view)} />
        )}
    </TabsContext.Consumer>;

    return (
        <TabsProvider defaultValue="daily">
            <ForecastBaseView
                controlSlot={forecastTypeControl}
                dataView={dataView}
                setDataView={setDataView}>
                <Tabs.Content value="daily">
                    <DataProvider data={forecastDailyData.response}>
                        <ForecastDailyTable dataView={dataView}/>
                    </DataProvider>
                </Tabs.Content>
                <Tabs.Content value="hourly">
                    <DataProvider data={[forecastHourlyData, sunMoonData]}>
                        <ForecastHourlyTable dataView={dataView}/>
                    </DataProvider>
                </Tabs.Content>
            </ForecastBaseView>
        </TabsProvider>
    );
};

export default ForecastView;
