import { useState, ReactNode } from 'react';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { ForecastDataView } from '@/types/forecast';
import { ForecastBaseView } from './ForecastBaseView';
import { ForecastDailyTable } from './ForecastDailyTable';

/**
 * @deprecated Use `<Forecast.View />` inside `<Forecast.Root>` with a single daily interval.
 */
export const ForecastDailyView = ({ controlSlot }: { controlSlot?: ReactNode }) => {
    const [dataView, setDataView] = useState<ForecastDataView>(DATA_VIEW_CONFIG.temperature.id);

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
