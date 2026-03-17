import type { ComponentType, ReactNode } from 'react';
import type { ColorRangeRootProps } from '@/components/compositions/colorRange';
import { ColorScaleStops } from './colors';
import { MeasurementType, Unit } from './units';

export type ForecastDataView = 'temperature' | 'precipitation' | 'wind' | 'snowfall';
/** @deprecated Use `ForecastDataView`. */
export type DataView = ForecastDataView;
export type ForecastIntervalStrategy = 'hourly' | 'daily' | 'custom';
export type ForecastIntervalDateDisplay = 'time' | 'date';
export type ForecastValueMode = 'single' | 'range';
export type ForecastTodayDataScope = 'start-of-day' | 'from-now';

export interface ForecastPeriod {
    icon: string;
    weatherPrimary: string;
    dateTimeISO: string;
    minTempF?: number;
    maxTempF?: number;
    minTempC?: number;
    maxTempC?: number;
    snowIn?: number;
    snowCM?: number;
    tempF?: number;
    tempC?: number;
    windSpeedMinMPH?: number;
    windSpeedMaxMPH?: number;
    windSpeedMPH?: number;
    windSpeedMinKPH?: number;
    windSpeedMaxKPH?: number;
    windSpeedKPH?: number;
    precipIN?: number;
    precipMM?: number;
    pop?: number;
    sunriseDateFormatted?: string | null;
    sunsetDateFormatted?: string | null;
}

/**
 * @deprecated This type is incorrectly shaped and only used by legacy forecast tables.
 * Use `ForecastNormalizedData` and `ForecastPeriod` from the new forecast pipeline instead.
 */
export interface DataResponse {
    response: {
        periods: SunMoonPeriod | ForecastPeriod;
    }
}

export interface SunMoonPeriod {
    sun: SunData;
}

export interface SunData {
    riseISO: string | null;
    setISO: string | null;
}

export interface ForecastViewProps {
    dataView: ForecastDataView;
}

export interface ForecastIntervalConfig {
    id: string;
    label: string;
    /**
     * API filter value for this interval.
     * Built-in presets use values such as '1day', '3hr', and '1hr'.
     */
    filter: string;
    params?: Record<string, string>;
    strategy?: ForecastIntervalStrategy;
    dateDisplay?: ForecastIntervalDateDisplay;
    valueMode?: ForecastValueMode;
    includeSunMoon?: boolean;
    todayDataScope?: ForecastTodayDataScope;
}

export interface ForecastParamsByEndpoint {
    forecasts?: Record<string, string>;
    sunMoon?: Record<string, string>;
    conditionsSummary?: Record<string, string>;
    outlook?: Record<string, string>;
}

export interface ForecastMetricConfig {
    id: ForecastDataView;
    label: string;
}

export interface ForecastPhrases {
    long?: string;
    longMET?: string;
}

export interface ForecastNormalizedIntervalData {
    config: ForecastIntervalConfig;
    periods: ForecastPeriod[];
}

export interface ForecastNormalizedData {
    intervals: Record<string, ForecastNormalizedIntervalData>;
    sunMoonPeriods: SunMoonPeriod[];
    outlook: ForecastPhrases | null;
}

export type ExpectedApiKeyRoot = 'temp' | 'windSpeed' | 'precip' | 'snow';
export type MaxApiKeyRoot = 'maxTemp' | 'windSpeedMax';
export type MinApiKeyRoot = 'minTemp' | 'windSpeedMin';

export interface ForecastDataViewConfigItem {
    id: ForecastDataView;
    measurementType: MeasurementType,
    apiKeyRoot: {
        min?: MinApiKeyRoot,
        max?: MaxApiKeyRoot,
        expected: ExpectedApiKeyRoot
    };
    colorScaleTargetUnits: Unit,
    colorScale: ColorScaleStops;
}
/** @deprecated Use `ForecastDataViewConfigItem`. */
export type DataViewConfigItem = ForecastDataViewConfigItem;

/**
 * Props passed to renderValue when customizing the value cell in Forecast.Table.
 */
export interface ForecastValueRenderProps {
    period: ForecastPeriod;
    index: number;
    dataView: ForecastDataView;
    valueMode: ForecastValueMode;
    measurementType: MeasurementType;
    colorRangeProps: Omit<ColorRangeRootProps, 'children'>;
}

/**
 * Render slots for overriding individual row parts in `Forecast.Table`.
 *
 * Each slot follows the same convention:
 * - `undefined` — render the built-in default
 * - `null` — hide the element entirely
 * - `function` — render custom content
 */
export interface ForecastRowSlots {
    renderIcon?: null | ((period: ForecastPeriod) => ReactNode);
    renderSunriseSunset?: null | ((period: ForecastPeriod) => ReactNode);
    renderPrecipChance?: null | ((period: ForecastPeriod) => ReactNode);
    renderHeader?: null | ((dataView: ForecastDataView) => ReactNode);
    renderValue?: null | ((props: ForecastValueRenderProps) => ReactNode);
    /** Overrides the entire row; other per-row slots are ignored when set. */
    renderRow?: (props: ForecastRowRenderProps) => ReactNode;
}

/**
 * Props passed to renderRow when overriding the full row in Forecast.Table.
 */
export interface ForecastRowRenderProps {
    period: ForecastPeriod;
    index: number;
    /**
     * Raw date display component for this interval (`DateDisplay.Time` or `DateDisplay.DateNumber`).
     * Requires a `<DateDisplay value={…}>` ancestor. Prefer `defaults.dateDisplay` unless
     * you need a custom date layout.
     */
    dateDisplayComponent: ComponentType<Record<string, unknown>>;
    colorRange: ReactNode;
    defaults: {
        icon: ReactNode;
        sunriseSunset: ReactNode;
        precipChance: ReactNode;
        /** Pre-rendered date label wrapped in `DateDisplay` context. */
        dateDisplay: ReactNode;
    };
}

/**
 * Shape of the value provided by `WeatherApiDataFetcher` through `DataProvider`.
 * Used as the target of a type guard when reading from the untyped `DataContext`.
 */
export interface WeatherApiDataContextShape {
    data: unknown;
    loading: boolean;
    error: Error | null;
}
