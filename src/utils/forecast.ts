import { parseISO, isAfter, isBefore } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { DataView, ForecastPeriod, SunData } from '@/types/forecast';
import { MEASUREMENT_TYPE, UNITS } from '@/constants/units';
import { getTimeZoneFromDateTimeISO } from '@/utils/date';
import { convert, isPrecipitationOrSnowfall } from '@/utils/units';
import { MeasurementType } from '@/types/units';

export const isPrecipitationView = (dataView: DataView) => dataView === 'precipitation';
export const isSnowView = (dataView: DataView) => dataView === 'snowfall';
export const isWindView = (dataView: DataView) => dataView === 'wind';

export const getPrecipitationRangeMaxValue = (rangeMax: number | null, units: string) => {
    const thresholdForMaxInInches = 0.25;
    const thresholdForMaxInCurrentUnits = convert(
        MEASUREMENT_TYPE.precipitation,
        thresholdForMaxInInches,
        UNITS.precipitation.in,
        units
    );

    return typeof rangeMax === 'number'
        ? (rangeMax >= thresholdForMaxInCurrentUnits ? rangeMax : thresholdForMaxInCurrentUnits)
        : 0;
};

export const getRangeMaxValue = (
    rangeMax: number | null,
    units: string,
    measurementType: MeasurementType
) => {
    if (!isPrecipitationOrSnowfall(measurementType)) {
        return typeof rangeMax === 'number' ? rangeMax : 0;
    }

    const THRESHOLDS_BY_MEASUREMENT_TYPE = {
        [MEASUREMENT_TYPE.precipitation]: {
            threshold: 0.25,
            baseUnit: UNITS.precipitation.in
        },
        [MEASUREMENT_TYPE.snowfall]: {
            threshold: 1,
            baseUnit: UNITS.snowfall.in
        }
    } as const;

    const { threshold, baseUnit } = THRESHOLDS_BY_MEASUREMENT_TYPE[measurementType];
    const thresholdForMaxInCurrentUnits = convert(
        measurementType,
        threshold,
        baseUnit,
        units
    );

    return typeof rangeMax === 'number'
        ? (rangeMax >= thresholdForMaxInCurrentUnits ? rangeMax : thresholdForMaxInCurrentUnits)
        : 0;
};

export const addSunsetSunriseTimes = (
    hourlyPeriods: ForecastPeriod[],
    sunsetSunrisePeriods: SunData[]
): ForecastPeriod[] => hourlyPeriods.reduce<ForecastPeriod[]>((acc, period, index, array) => {
    const periodDate = parseISO(period.dateTimeISO);
    const timeZone = getTimeZoneFromDateTimeISO(period.dateTimeISO);

    let sunriseDateFormatted: string | null = null;
    let sunsetDateFormatted: string | null = null;

    sunsetSunrisePeriods.forEach(({ riseISO, setISO }) => {
        const sunrise = riseISO ? parseISO(riseISO) : null;
        const sunset = setISO ? parseISO(setISO) : null;

        if (index > 0) {
            const prevDate = parseISO(array[index - 1].dateTimeISO);
            if (sunrise && isBefore(prevDate, sunrise) && isAfter(periodDate, sunrise)) {
                sunriseDateFormatted = formatInTimeZone(sunrise, timeZone, 'h:mm a').toLowerCase();
            }

            if (sunset && isBefore(prevDate, sunset) && isAfter(periodDate, sunset)) {
                sunsetDateFormatted = formatInTimeZone(sunset, timeZone, 'h:mm a').toLowerCase();
            }
        }
    });

    const updatedPeriod: ForecastPeriod = {
        ...period,
        sunriseDateFormatted,
        sunsetDateFormatted
    };

    acc.push(updatedPeriod);
    return acc;
}, []);

export const getForecastPeriodValue = (period: ForecastPeriod, key: string | null) => (
    key && typeof period[key as keyof ForecastPeriod] === 'number'
        ? period[key as keyof ForecastPeriod] as number
        : 0
);
