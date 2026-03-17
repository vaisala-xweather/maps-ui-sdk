import { useState, ReactNode } from 'react';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import { ForecastDataView } from '@/types/forecast';
import { ForecastBaseView } from './ForecastBaseView';
import { ForecastHourlyTable } from './ForecastHourlyTable';

/**
 * @deprecated Use `<Forecast.View />` inside `<Forecast.Root>` with a single hourly interval.
 */
export const ForecastHourlyView = ({ controlSlot }: { controlSlot?: ReactNode }) => {
    const [dataView, setDataView] = useState<ForecastDataView>(DATA_VIEW_CONFIG.temperature.id);

    return (
        <ForecastBaseView
            controlSlot={controlSlot}
            dataView={dataView}
            setDataView={setDataView}>
            <ForecastHourlyTable
                dataView={dataView} />
        </ForecastBaseView>
    );
};
