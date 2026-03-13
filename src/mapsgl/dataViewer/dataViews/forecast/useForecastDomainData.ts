import { ComponentType, useMemo } from 'react';
import { DATA_VIEW_CONFIG } from '@/constants/forecast';
import {
    ForecastDataView,
    type ForecastDataViewConfigItem,
    ForecastIntervalConfig,
    ForecastPeriod,
    type ForecastValueMode
} from '@/types/forecast';
import { DateDisplay } from '@/components/primitives/display/dateDisplay';
import { DateBaseProps } from '@/components/primitives/display/dateDisplay/DateBase';
import {
    getMergedPeriods,
    resolveIntervalDateDisplay,
    resolveIntervalValueMode
} from '@/utils/forecast';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { getSuffix } from '@/utils/units';
import { MeasurementType } from '@/types/units';
import { useForecastContext } from './ForecastProvider';

interface UseForecastDomainDataOptions {
    intervalId?: string;
    dataView?: ForecastDataView;
}

export interface ForecastDomainData {
    periods: ForecastPeriod[];
    dataView: ForecastDataView;
    intervalConfig: ForecastIntervalConfig;
    valueMode: ForecastValueMode;
    dateDisplayComponent: ComponentType<Omit<DateBaseProps, 'children'>>;
    measurementType: MeasurementType;
    expectedKey: string;
    config: ForecastDataViewConfigItem;
}

export function useForecastDomainData(
    options: UseForecastDomainDataOptions = {}
): ForecastDomainData | null {
    const { intervalId, dataView: dataViewOverride } = options;
    const {
        intervals,
        activeIntervalId,
        activePeriods,
        dataView: currentDataView,
        normalizedData
    } = useForecastContext();

    const { units } = useSettingsContext();
    const resolvedDataView = dataViewOverride ?? currentDataView;
    const resolvedIntervalId = intervalId ?? activeIntervalId;

    const intervalConfig = useMemo(
        () => intervals.find((interval) => interval.id === resolvedIntervalId) ?? null,
        [intervals, resolvedIntervalId]
    );

    const basePeriods = useMemo(
        () => normalizedData.intervals[resolvedIntervalId]?.periods ?? [],
        [normalizedData, resolvedIntervalId]
    );

    const displayPeriods = useMemo(() => {
        if (!intervalConfig) return [];
        if (resolvedIntervalId === activeIntervalId) return activePeriods;

        return getMergedPeriods(
            basePeriods,
            normalizedData.sunMoonPeriods,
            intervalConfig
        );
    }, [
        basePeriods,
        intervalConfig,
        resolvedIntervalId,
        activeIntervalId,
        activePeriods,
        normalizedData.sunMoonPeriods
    ]);

    const valueMode = useMemo(() => resolveIntervalValueMode(intervalConfig), [intervalConfig]);

    const dateDisplayComponent = useMemo((): ComponentType<Omit<DateBaseProps, 'children'>> => {
        const dateDisplay = resolveIntervalDateDisplay(intervalConfig);
        return dateDisplay === 'time' ? DateDisplay.Time : DateDisplay.DateNumber;
    }, [intervalConfig]);

    const config = useMemo(() => {
        if (!resolvedDataView) return null;
        return DATA_VIEW_CONFIG[resolvedDataView];
    }, [resolvedDataView]);

    const expectedKey = useMemo(() => {
        if (!config) return '';
        const suffix = getSuffix(config.measurementType, units[config.measurementType]);
        return `${config.apiKeyRoot.expected}${suffix}`;
    }, [config, units]);

    return useMemo((): ForecastDomainData | null => {
        if (!intervalConfig || displayPeriods.length === 0 || !config) {
            return null;
        }
        return {
            periods: displayPeriods,
            dataView: resolvedDataView,
            intervalConfig,
            valueMode,
            dateDisplayComponent,
            measurementType: config.measurementType,
            expectedKey,
            config
        };
    }, [
        intervalConfig,
        displayPeriods,
        config,
        resolvedDataView,
        valueMode,
        dateDisplayComponent,
        expectedKey
    ]);
}
