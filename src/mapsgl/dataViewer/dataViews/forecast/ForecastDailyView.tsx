import { useState, ReactNode } from 'react';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { DataView } from '@/types/forecast';
import { ForecastBaseView } from './ForecastBaseView';
import { ForecastDailyTable } from './ForecastDailyTable';

export const ForecastDailyView = ({ controlSlot }: {controlSlot?: ReactNode}) => {
    const [dataView, setDataView] = useState<DataView>(DATA_VIEW_CONFIG.temperature.id);

    return (
        <ForecastBaseView
            controlSlot={controlSlot}
            dataView={dataView}
            setDataView={setDataView}>
            <ForecastDailyTable
                dataView={dataView} />
        </ForecastBaseView>
    );
};
