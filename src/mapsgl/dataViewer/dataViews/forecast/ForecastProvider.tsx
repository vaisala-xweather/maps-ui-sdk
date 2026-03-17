import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState
} from 'react';
import { Option } from '@/types/control';
import {
    ForecastDataView,
    ForecastIntervalConfig,
    ForecastMetricConfig,
    ForecastNormalizedData,
    ForecastPeriod
} from '@/types/forecast';
import {
    DEFAULT_FORECAST_METRICS,
    DATA_VIEW_CONFIG
} from '@/constants/forecast';
import { useDataContext } from '@/providers/DataProvider';
import {
    getMergedPeriods,
    normalizeForecastBatchResponses,
    parseWeatherApiDataContext,
    resolveForecastIntervals
} from '@/utils/forecast';

/* ── Data view validation ─────────────────────────────────────────────── */

const DATA_VIEW_IDS = new Set<string>(Object.keys(DATA_VIEW_CONFIG));
const isForecastDataView = (value: string): value is ForecastDataView => DATA_VIEW_IDS.has(value);

/* ── Empty default ─────────────────────────────────────────────────────── */

const EMPTY_NORMALIZED_DATA: ForecastNormalizedData = {
    intervals: {},
    sunMoonPeriods: [],
    outlook: null
};

/* ── Data normalization ────────────────────────────────────────────────── */

interface UseForecastNormalizedDataArgs {
    externalData?: ForecastNormalizedData;
    intervals: ForecastIntervalConfig[];
    includeSunMoon?: boolean;
    includeOutlook: boolean;
}

const useForecastNormalizedData = ({
    externalData,
    intervals,
    includeSunMoon,
    includeOutlook
}: UseForecastNormalizedDataArgs) => {
    const dataContext = useDataContext();
    const { rawData, loading: ctxLoading, error: ctxError } = parseWeatherApiDataContext(dataContext);

    const isExternal = !!externalData;

    const normalizedData = useMemo(() => {
        if (externalData) return externalData;

        return normalizeForecastBatchResponses({
            responses: rawData,
            intervals,
            includeSunMoon,
            includeOutlook
        });
    }, [externalData, rawData, intervals, includeSunMoon, includeOutlook]);

    return {
        normalizedData,
        loading: isExternal ? false : ctxLoading,
        error: isExternal ? null : ctxError
    };
};

/* ── Context ──────────────────────────────────────────────────────────── */

export interface ForecastContextValue {
    intervals: ForecastIntervalConfig[];
    intervalOptions: Option[];
    metrics: ForecastMetricConfig[];
    metricOptions: Option[];
    activeIntervalId: string;
    setActiveIntervalId: (id: string) => void;
    activeInterval: ForecastIntervalConfig | null;
    dataView: ForecastDataView;
    setDataView: (dataView: ForecastDataView) => void;
    normalizedData: ForecastNormalizedData;
    activePeriods: ForecastPeriod[];
    loading: boolean;
    error: Error | null;
}

export const ForecastContext = createContext<ForecastContextValue | undefined>(undefined);

/* ── Provider ─────────────────────────────────────────────────────────── */

export interface ForecastProviderProps {
    children: ReactNode;
    intervals?: ForecastIntervalConfig[];
    metrics?: ForecastMetricConfig[];
    defaultIntervalId?: string;
    defaultDataView?: ForecastDataView;
    includeSunMoon?: boolean;
    includeOutlook?: boolean;
    data?: ForecastNormalizedData;
}

export const ForecastProvider = ({
    children,
    intervals,
    metrics = DEFAULT_FORECAST_METRICS,
    defaultIntervalId,
    defaultDataView,
    includeSunMoon,
    includeOutlook = true,
    data
}: ForecastProviderProps) => {
    const configuredIntervals = useMemo(
        () => resolveForecastIntervals(intervals),
        [intervals]
    );

    const configuredMetrics = useMemo(
        () => (metrics.length > 0 ? metrics : DEFAULT_FORECAST_METRICS),
        [metrics]
    );

    const { normalizedData, loading, error } = useForecastNormalizedData({
        externalData: data,
        intervals: configuredIntervals,
        includeSunMoon,
        includeOutlook
    });

    /* ── Interval state ────────────────────────────────────────────── */

    const [intervalState, setIntervalState] = useState(() => (
        defaultIntervalId ?? configuredIntervals[0]?.id ?? ''
    ));

    const intervalIds = useMemo(
        () => configuredIntervals.map((interval) => interval.id),
        [configuredIntervals]
    );

    const activeIntervalId = intervalIds.includes(intervalState)
        ? intervalState
        : (configuredIntervals[0]?.id ?? '');

    const setActiveIntervalId = useCallback((nextIntervalId: string) => {
        setIntervalState((current) => (
            current === nextIntervalId || !intervalIds.includes(nextIntervalId)
                ? current
                : nextIntervalId
        ));
    }, [intervalIds]);

    const activeInterval = useMemo(
        () => configuredIntervals.find((interval) => interval.id === activeIntervalId) ?? null,
        [configuredIntervals, activeIntervalId]
    );

    /* ── Metric state ──────────────────────────────────────────────── */

    const [dataViewState, setDataViewState] = useState<ForecastDataView>(() => {
        if (defaultDataView && configuredMetrics.some((m) => m.id === defaultDataView)) {
            return defaultDataView;
        }
        return configuredMetrics[0]?.id ?? DATA_VIEW_CONFIG.temperature.id;
    });

    const metricIds = useMemo(
        () => configuredMetrics.map((metric) => metric.id),
        [configuredMetrics]
    );

    const activeDataView = metricIds.includes(dataViewState)
        ? dataViewState
        : (configuredMetrics[0]?.id ?? DATA_VIEW_CONFIG.temperature.id);

    const setDataView = useCallback((nextDataView: ForecastDataView) => {
        setDataViewState((current) => (
            current === nextDataView || !metricIds.includes(nextDataView)
                ? current
                : nextDataView
        ));
    }, [metricIds]);

    /* ── Derived data ──────────────────────────────────────────────── */

    const activePeriods = useMemo(() => {
        const intervalData = normalizedData.intervals[activeIntervalId];
        if (!intervalData || !activeInterval) return [];

        return getMergedPeriods(
            intervalData.periods,
            normalizedData.sunMoonPeriods,
            activeInterval
        );
    }, [normalizedData, activeIntervalId, activeInterval]);

    const intervalOptions = useMemo(() => configuredIntervals.map((interval) => ({
        label: interval.label,
        value: interval.id
    })), [configuredIntervals]);

    const metricOptions = useMemo(() => configuredMetrics
        .map((metric) => ({
            label: metric.label,
            value: metric.id
        }))
        .filter((option) => isForecastDataView(option.value)), [configuredMetrics]);

    /* ── Context assembly ──────────────────────────────────────────── */

    const value = useMemo<ForecastContextValue>(() => ({
        intervals: configuredIntervals,
        intervalOptions,
        metrics: configuredMetrics,
        metricOptions,
        activeIntervalId,
        setActiveIntervalId,
        activeInterval,
        dataView: activeDataView,
        setDataView,
        normalizedData: normalizedData ?? EMPTY_NORMALIZED_DATA,
        activePeriods,
        loading,
        error
    }), [
        configuredIntervals,
        intervalOptions,
        configuredMetrics,
        metricOptions,
        activeIntervalId,
        setActiveIntervalId,
        activeInterval,
        activeDataView,
        setDataView,
        normalizedData,
        activePeriods,
        loading,
        error
    ]);

    return (
        <ForecastContext.Provider value={value}>
            {children}
        </ForecastContext.Provider>
    );
};

/* ── Hooks ─────────────────────────────────────────────────────────────── */

export const useForecastContext = () => {
    const context = useContext(ForecastContext);
    if (!context) {
        throw new Error('useForecastContext must be used within <ForecastProvider>.');
    }
    return context;
};

export const useForecastContextOptional = () => useContext(ForecastContext);

export const useForecastIntervals = () => {
    const {
        intervals,
        intervalOptions,
        activeIntervalId,
        setActiveIntervalId,
        activeInterval
    } = useForecastContext();

    return {
        intervals,
        intervalOptions,
        activeIntervalId,
        setActiveIntervalId,
        activeInterval
    };
};

export const useForecastMetrics = () => {
    const {
        metrics,
        metricOptions,
        dataView,
        setDataView
    } = useForecastContext();

    return {
        metrics,
        metricOptions,
        dataView,
        setDataView
    };
};

export const useForecastActivePeriods = () => {
    const {
        activePeriods,
        activeInterval,
        loading,
        error
    } = useForecastContext();

    return {
        activePeriods,
        activeInterval,
        loading,
        error
    };
};
