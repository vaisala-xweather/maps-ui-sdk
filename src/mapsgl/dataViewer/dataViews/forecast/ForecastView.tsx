import { ReactNode } from 'react';
import { HStack } from '@/components/primitives/layout/Stack';
import { ForecastIntervalSelector } from './ForecastIntervalSelector';
import { ForecastMetricSelector } from './ForecastMetricSelector';
import { ForecastOutlook } from './ForecastOutlook';
import { ForecastTable } from './ForecastTable';
import { useForecastContextOptional } from './ForecastProvider';
import { ForecastViewLegacy } from './ForecastViewLegacy';

function resolveSlot(slot: ReactNode | null | undefined, defaultNode: ReactNode): ReactNode {
    if (slot === null) return null;
    if (slot !== undefined) return slot;
    return defaultNode;
}

type ForecastViewSlot = ReactNode | null;

export interface ForecastViewProps {
    className?: string;
    /** Slot props follow the same contract: undefined = default, null = hide, ReactNode = custom. */
    outlook?: ForecastViewSlot;
    intervalControl?: ForecastViewSlot;
    metricControl?: ForecastViewSlot;
    table?: ForecastViewSlot;
}

export const ForecastView = ({
    className,
    outlook,
    intervalControl,
    metricControl,
    table
}: ForecastViewProps) => {
    const context = useForecastContextOptional();

    // Backward compatibility: legacy standalone ForecastView usage relies on DataProvider shape,
    // not ForecastProvider context.
    if (!context) {
        return <ForecastViewLegacy />;
    }

    const outlookSlot = resolveSlot(outlook, <ForecastOutlook className="xw-mb-5" />);
    const controlSlot = resolveSlot(intervalControl, <ForecastIntervalSelector />);
    const metricControlSlot = resolveSlot(metricControl, <ForecastMetricSelector />);
    const tableContent = resolveSlot(table, <ForecastTable />);

    return (
        <div className={className ?? 'xw-mt-3'}>
            {outlookSlot}
            {(controlSlot || metricControlSlot)
                ? (
                    <HStack className="xw-py-2">
                        {controlSlot}
                        {metricControlSlot ? <div className="xw-ml-auto">{metricControlSlot}</div> : null}
                    </HStack>
                )
                : null}
            {tableContent}
        </div>
    );
};

ForecastView.displayName = 'Forecast.View';

export default ForecastView;
