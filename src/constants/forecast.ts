import {
    ForecastDataView,
    ForecastDataViewConfigItem,
    ForecastIntervalConfig,
    ForecastMetricConfig
} from '@/types/forecast';
import { UNITS, MEASUREMENT_TYPE } from '@/constants/units';
import {
    TEMPERATURE_COLOR_SCALE,
    WIND_SPEED_COLOR_SCALE,
    PRECIP_ACCUMULATION_COLOR_SCALE,
    SNOW_DEPTH_COLOR_SCALE
} from './colors';

export const DATA_VIEW_CONFIG: Record<ForecastDataView, ForecastDataViewConfigItem> = {
    temperature: {
        id: 'temperature',
        measurementType: MEASUREMENT_TYPE.temperature,
        apiKeyRoot: {
            min: 'minTemp',
            max: 'maxTemp',
            expected: 'temp'
        },
        colorScaleTargetUnits: UNITS.temperature.degC,
        colorScale: TEMPERATURE_COLOR_SCALE
    },
    wind: {
        id: 'wind',
        measurementType: MEASUREMENT_TYPE.speed,
        apiKeyRoot: {
            min: 'windSpeedMin',
            max: 'windSpeedMax',
            expected: 'windSpeed'
        },
        colorScaleTargetUnits: UNITS.speed.mps,
        colorScale: WIND_SPEED_COLOR_SCALE
    },
    precipitation: {
        id: 'precipitation',
        measurementType: MEASUREMENT_TYPE.precipitation,
        apiKeyRoot: {
            expected: 'precip'
        },
        colorScaleTargetUnits: UNITS.precipitation.mm,
        colorScale: PRECIP_ACCUMULATION_COLOR_SCALE
    },
    snowfall: {
        id: 'snowfall',
        measurementType: MEASUREMENT_TYPE.snowfall,
        apiKeyRoot: {
            expected: 'snow'
        },
        colorScaleTargetUnits: UNITS.snowfall.m,
        colorScale: SNOW_DEPTH_COLOR_SCALE
    }
};

export const FORECAST_INTERVAL_PRESETS = {
    oneHour: {
        id: '1hr',
        label: 'Hourly',
        filter: '1hr',
        params: { limit: '24' },
        strategy: 'hourly',
        dateDisplay: 'time',
        valueMode: 'single',
        includeSunMoon: true
    },
    threeHour: {
        id: '3hr',
        label: '3 Hour',
        filter: '3hr',
        params: { limit: '8' },
        strategy: 'hourly',
        dateDisplay: 'time',
        valueMode: 'single',
        includeSunMoon: true
    },
    oneDay: {
        id: '1day',
        label: 'Daily',
        filter: '1day',
        params: { limit: '7' },
        strategy: 'daily',
        dateDisplay: 'date',
        valueMode: 'range',
        includeSunMoon: false,
        todayDataScope: 'start-of-day'
    }
} as const satisfies Record<string, ForecastIntervalConfig>;

export const DEFAULT_FORECAST_INTERVALS: ForecastIntervalConfig[] = [
    FORECAST_INTERVAL_PRESETS.oneDay,
    FORECAST_INTERVAL_PRESETS.threeHour
];

export const DEFAULT_FORECAST_METRICS: ForecastMetricConfig[] = [{
    id: DATA_VIEW_CONFIG.temperature.id,
    label: 'Temperature'
}, {
    id: DATA_VIEW_CONFIG.wind.id,
    label: 'Wind'
}, {
    id: DATA_VIEW_CONFIG.precipitation.id,
    label: 'Precipitation'
}, {
    id: DATA_VIEW_CONFIG.snowfall.id,
    label: 'Snowfall'
}];
