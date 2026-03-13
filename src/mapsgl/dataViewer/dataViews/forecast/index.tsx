import { ReactNode } from 'react';
import { ForecastProvider, type ForecastProviderProps } from './ForecastProvider';
import { ForecastView, type ForecastViewProps } from './ForecastView';
import { ForecastIntervalSelector, type ForecastIntervalSelectorProps } from './ForecastIntervalSelector';
import { ForecastMetricSelector, type ForecastMetricSelectorProps } from './ForecastMetricSelector';
import { ForecastOutlook, type ForecastOutlookProps } from './ForecastOutlook';
import { ForecastTable, type ForecastTableProps } from './ForecastTable';

type ForecastRootProps = ForecastProviderProps;

const ForecastRoot = ({ children, ...rest }: ForecastRootProps): ReactNode => (
    <ForecastProvider {...rest}>
        {children}
    </ForecastProvider>
);

ForecastRoot.displayName = 'Forecast.Root';

type ForecastProps = ForecastRootProps;

/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
// Compound Component
const Forecast = ({ children, ...rest }: ForecastProps): ReactNode => (
    <ForecastRoot {...rest}>
        {children}
    </ForecastRoot>
);
Forecast.displayName = 'Forecast';

Forecast.Root = ForecastRoot;
Forecast.Provider = ForecastProvider;
Forecast.View = ForecastView;
Forecast.IntervalSelector = ForecastIntervalSelector;
Forecast.MetricSelector = ForecastMetricSelector;
Forecast.Outlook = ForecastOutlook;
Forecast.Table = ForecastTable;

export { Forecast, type ForecastProps };

// Context
export {
    ForecastContext,
    useForecastContext,
    useForecastIntervals,
    useForecastMetrics,
    useForecastActivePeriods,
    type ForecastContextValue
} from './ForecastProvider';

// Sub-components
export { ForecastRoot, type ForecastRootProps };
export { ForecastProvider, type ForecastProviderProps } from './ForecastProvider';
export { ForecastView, type ForecastViewProps } from './ForecastView';
export { ForecastIntervalSelector, type ForecastIntervalSelectorProps } from './ForecastIntervalSelector';
export { ForecastMetricSelector, type ForecastMetricSelectorProps } from './ForecastMetricSelector';
export { ForecastOutlook, type ForecastOutlookProps } from './ForecastOutlook';
export { ForecastTable, type ForecastTableProps } from './ForecastTable';
export type {
    ForecastDataView,
    ForecastIntervalConfig,
    ForecastMetricConfig,
    ForecastNormalizedData,
    ForecastParamsByEndpoint,
    ForecastPeriod,
    ForecastRowSlots,
    ForecastRowRenderProps,
    ForecastValueRenderProps
} from '@/types/forecast';
export { FORECAST_INTERVAL_PRESETS } from '@/constants/forecast';
/* ══════════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
