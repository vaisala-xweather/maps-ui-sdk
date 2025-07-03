import { DataViewConfigItem } from '@/types/forecast';
import { UNITS, MEASUREMENT_TYPE } from '@/constants/units';
import {
    TEMPERATURE_COLOR_SCALE,
    WIND_SPEED_COLOR_SCALE,
    PRECIP_ACCUMULATION_COLOR_SCALE,
    SNOW_DEPTH_COLOR_SCALE
} from './colors';

export const DATA_VIEW_CONFIG: { [key: string]: DataViewConfigItem } = {
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
