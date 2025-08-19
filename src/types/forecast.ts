import { ColorScaleStops } from './colors';
import { MeasurementType, Unit } from './units';

export type DataView = 'temperature' | 'precipitation' | 'wind' | 'snowfall';

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
    dataView: DataView;
}

export type ExpectedApiKeyRoot = 'temp' | 'windSpeed' | 'precip' | 'snow';
export type MaxApiKeyRoot = 'maxTemp' | 'windSpeedMax';
export type MinApiKeyRoot = 'minTemp' | 'windSpeedMin';

export interface DataViewConfigItem {
    id: DataView;
    measurementType: MeasurementType,
    apiKeyRoot: {
        min?: MinApiKeyRoot,
        max?: MaxApiKeyRoot,
        expected: ExpectedApiKeyRoot
    };
    colorScaleTargetUnits: Unit,
    colorScale: ColorScaleStops;
}
