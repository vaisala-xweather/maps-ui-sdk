import { parseISO, isAfter, isBefore } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { UseWeatherApiRequest } from '@/mapsgl/useWeatherApi';
import {
    ForecastDataView,
    ForecastIntervalConfig,
    ForecastIntervalDateDisplay,
    ForecastNormalizedData,
    ForecastParamsByEndpoint,
    ForecastPeriod,
    ForecastPhrases,
    ForecastValueMode,
    SunData,
    SunMoonPeriod,
    WeatherApiDataContextShape
} from '@/types/forecast';
import { DEFAULT_FORECAST_INTERVALS } from '@/constants/forecast';
import { MEASUREMENT_TYPE, UNITS } from '@/constants/units';
import { getTimeZoneFromDateTimeISO, isDateToday } from '@/utils/date';
import { convert, isPrecipitationOrSnowfall } from '@/utils/units';
import { MeasurementType } from '@/types/units';

export const isPrecipitationView = (dataView: ForecastDataView) => dataView === 'precipitation';
export const isSnowView = (dataView: ForecastDataView) => dataView === 'snowfall';
export const isWindView = (dataView: ForecastDataView) => dataView === 'wind';

/* ── Data context helpers ─────────────────────────────────────────────── */

const isWeatherApiDataContext = (ctx: unknown): ctx is WeatherApiDataContextShape => (
    ctx !== null
    && ctx !== undefined
    && typeof ctx === 'object'
    && 'data' in ctx
    && 'loading' in ctx
);

/** Normalizes `DataContext` values from `WeatherApiDataFetcher` or `DataProvider`. */
export const parseWeatherApiDataContext = (ctx: unknown): {
    rawData: unknown;
    loading: boolean;
    error: Error | null;
} => {
    if (isWeatherApiDataContext(ctx)) {
        return {
            rawData: ctx.data,
            loading: Boolean(ctx.loading),
            error: ctx.error instanceof Error ? ctx.error : null
        };
    }
    return { rawData: ctx, loading: false, error: null };
};

/* ── Period merge helper ──────────────────────────────────────────────── */

/** Adds sunrise and sunset labels when the interval requires sun/moon data. */
export const getMergedPeriods = (
    periods: ForecastPeriod[],
    sunMoonPeriods: SunMoonPeriod[],
    intervalConfig: ForecastIntervalConfig
): ForecastPeriod[] => {
    if (periods.length === 0) return [];

    const shouldMerge = intervalRequiresSunMoon(intervalConfig);
    if (!shouldMerge || sunMoonPeriods.length === 0) return periods;

    return addSunsetSunriseTimes(
        periods,
        sunMoonPeriods.map((period) => period.sun)
    );
};

/* ── Range calculation helper ─────────────────────────────────────────── */

const getForecastPeriodField = (period: ForecastPeriod, key: string): unknown => (
    (period as unknown as Record<string, unknown>)[key]
);

const getForecastPeriodNumericField = (period: ForecastPeriod, key: string): number | null => {
    const value = getForecastPeriodField(period, key);
    return typeof value === 'number' ? value : null;
};

/** Calculates min/max values for numeric period fields. */
export const calculateForecastRangeMinMax = (
    periods: ForecastPeriod[],
    minKey: string,
    maxKey: string
): { rangeMin: number | null; rangeMax: number | null } => {
    if (periods.length === 0) {
        return { rangeMin: null, rangeMax: null };
    }

    return periods.reduce<{ rangeMin: number | null; rangeMax: number | null }>(
        (acc, period) => {
            const minVal = getForecastPeriodNumericField(period, minKey);
            const maxVal = getForecastPeriodNumericField(period, maxKey);

            if (minVal !== null) {
                acc.rangeMin = acc.rangeMin === null ? minVal : Math.min(acc.rangeMin, minVal);
            }

            if (maxVal !== null) {
                acc.rangeMax = acc.rangeMax === null ? maxVal : Math.max(acc.rangeMax, maxVal);
            }

            return acc;
        },
        { rangeMin: null, rangeMax: null }
    );
};

/* ── Outlook text helper ──────────────────────────────────────────────── */

/** Returns the outlook text for the active temperature unit. */
export const getOutlookText = (
    outlook: ForecastPhrases,
    temperatureUnit: string
): string | undefined => (
    temperatureUnit === UNITS.temperature.degF
        ? outlook.long
        : outlook.longMET
);

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
    const timeZone = getTimeZoneFromDateTimeISO(period.dateTimeISO) ?? 'UTC';

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

export const getForecastPeriodValue = (period: ForecastPeriod, key: string | null) => {
    if (!key) return 0;
    const numericValue = getForecastPeriodNumericField(period, key);
    return numericValue ?? 0;
};

interface BuildForecastRequestsArgs {
    coordinatesString: string | null;
    intervals: ForecastIntervalConfig[];
    paramsByEndpoint?: ForecastParamsByEndpoint;
    includeSunMoon?: boolean;
    includeOutlook?: boolean;
}

interface NormalizeForecastBatchResponsesArgs {
    responses: unknown;
    intervals: ForecastIntervalConfig[];
    includeSunMoon?: boolean;
    includeOutlook?: boolean;
}

interface ConditionsSummaryPeriod {
    dateTimeISO?: string;
    temp?: { minF?: number; minC?: number };
}

/** Maps a summary min-temp field to its forecast min/max keys. */
interface MinTempShiftField {
    extractFromSummary: (summary: ConditionsSummaryPeriod) => number | undefined;
    minKey: string;
    maxKey: string;
}

const CONDITIONS_SUMMARY_MIN_TEMP_FIELDS = 'periods.dateTimeISO,periods.temp.minF,periods.temp.minC';

const MIN_TEMP_SHIFT_FIELDS: MinTempShiftField[] = [{
    extractFromSummary: (summary) => summary.temp?.minF,
    minKey: 'minTempF',
    maxKey: 'maxTempF'
}, {
    extractFromSummary: (summary) => summary.temp?.minC,
    minKey: 'minTempC',
    maxKey: 'maxTempC'
}];

const hasMinTempSummaryData = (summary: ConditionsSummaryPeriod): boolean => (
    MIN_TEMP_SHIFT_FIELDS.some((field) => field.extractFromSummary(summary) !== undefined)
);

interface OptionalForecastResponses {
    sunMoonPeriods: SunMoonPeriod[];
    outlook: ForecastPhrases | null;
    todaySummary: ConditionsSummaryPeriod | null;
}

const getResponsePayload = (responseItem: unknown) => (
    (responseItem && typeof responseItem === 'object' && 'response' in responseItem)
        ? (responseItem as { response?: unknown }).response
        : null
);

const isObject = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null
);

const getFirstResponsePayloadItem = (responseItem: unknown): Record<string, unknown> | null => {
    const payload = getResponsePayload(responseItem);
    if (!Array.isArray(payload) || payload.length === 0 || !isObject(payload[0])) {
        return null;
    }

    return payload[0] as Record<string, unknown>;
};

const getForecastPeriodsFromResponse = (responseItem: unknown): ForecastPeriod[] => {
    const payload = getResponsePayload(responseItem);
    if (!Array.isArray(payload) || payload.length === 0) {
        return [];
    }

    const periods = payload[0]?.periods;
    return Array.isArray(periods) ? periods as ForecastPeriod[] : [];
};

const getSunMoonPeriodsFromResponse = (responseItem: unknown): SunMoonPeriod[] => {
    const payload = getResponsePayload(responseItem);
    return Array.isArray(payload) ? payload as SunMoonPeriod[] : [];
};

const getOutlookFromResponse = (responseItem: unknown): ForecastPhrases | null => {
    const payload = getResponsePayload(responseItem);
    if (!Array.isArray(payload) || payload.length === 0) {
        return null;
    }

    const phrases = payload[0]?.phrases;
    return (phrases && typeof phrases === 'object') ? phrases as ForecastPhrases : null;
};

const isSunMoonResponse = (responseItem: unknown): boolean => {
    const firstPayloadItem = getFirstResponsePayloadItem(responseItem);
    return Boolean(firstPayloadItem && isObject(firstPayloadItem.sun));
};

const isOutlookResponse = (responseItem: unknown): boolean => {
    const firstPayloadItem = getFirstResponsePayloadItem(responseItem);
    return Boolean(firstPayloadItem && isObject(firstPayloadItem.phrases));
};

const isTodaySummaryResponse = (responseItem: unknown): boolean => {
    const firstPayloadItem = getFirstResponsePayloadItem(responseItem);
    if (!firstPayloadItem) return false;

    const periods = firstPayloadItem.periods;
    if (!Array.isArray(periods) || periods.length === 0 || !isObject(periods[0])) {
        return false;
    }

    const firstPeriod = periods[0] as Record<string, unknown>;
    return isObject(firstPeriod.temp);
};

const getNumericValue = (value: unknown): number | undefined => (
    typeof value === 'number' && Number.isFinite(value) ? value : undefined
);

const parseTodaySummaryFromResponse = (responseItem: unknown): ConditionsSummaryPeriod | null => {
    const payload = getResponsePayload(responseItem);
    if (!Array.isArray(payload) || payload.length === 0) {
        return null;
    }

    const periods = payload[0]?.periods;
    if (!Array.isArray(periods) || periods.length === 0) {
        return null;
    }

    const todayPeriod = periods.find((period: unknown) => {
        if (!isObject(period) || typeof period.dateTimeISO !== 'string') {
            return false;
        }
        const summaryDate = parseISO(period.dateTimeISO);
        const summaryTimeZone = getTimeZoneFromDateTimeISO(period.dateTimeISO);
        return !Number.isNaN(summaryDate.getTime()) && isDateToday(summaryDate, summaryTimeZone);
    });
    if (!todayPeriod || !isObject(todayPeriod)) {
        return null;
    }

    const summarySource = todayPeriod as Record<string, unknown>;
    const summary: ConditionsSummaryPeriod = {};

    if (typeof summarySource.dateTimeISO === 'string') {
        summary.dateTimeISO = summarySource.dateTimeISO;
    }

    if (isObject(summarySource.temp)) {
        const temp = summarySource.temp as Record<string, unknown>;
        summary.temp = {
            minF: getNumericValue(temp.minF),
            minC: getNumericValue(temp.minC)
        };
    }

    if (!hasMinTempSummaryData(summary)) {
        return null;
    }

    return summary;
};

/**
 * Shifts day-style `minTemp` values to the displayed date they belong to.
 * Period 0 can be seeded from `conditions/summary`; later periods use the
 * previous raw forecast period. Swaps min/max if shifting inverts the range.
 */
const shiftMinTempValues = (
    periods: ForecastPeriod[],
    todaySummary: ConditionsSummaryPeriod | null,
    replaceFirstPeriodMin: boolean
): ForecastPeriod[] => {
    if (periods.length === 0) return periods;

    let changed = false;
    const result = periods.map((period, index) => {
        const updates: Record<string, number> = {};
        let hasUpdates = false;

        MIN_TEMP_SHIFT_FIELDS.forEach(({ extractFromSummary, minKey, maxKey }) => {
            let newMin: number | undefined;

            if (index === 0) {
                newMin = replaceFirstPeriodMin && todaySummary
                    ? extractFromSummary(todaySummary)
                    : undefined;
            } else {
                const prevOriginal = getForecastPeriodNumericField(periods[index - 1], minKey);
                newMin = prevOriginal ?? undefined;
            }

            if (newMin === undefined) return;

            const currentMin = getForecastPeriodNumericField(period, minKey);
            const currentMax = getForecastPeriodNumericField(period, maxKey);
            let nextMin = newMin;
            let nextMax = currentMax;

            if (currentMax !== null && newMin > currentMax) {
                nextMin = currentMax;
                nextMax = newMin;
            }

            if (currentMin === nextMin && currentMax === nextMax) {
                return;
            }

            updates[minKey] = nextMin;
            hasUpdates = true;

            if (nextMax !== currentMax && nextMax !== null) {
                updates[maxKey] = nextMax;
            }
        });

        if (!hasUpdates) return period;

        changed = true;
        return { ...period, ...updates };
    });

    return changed ? result : periods;
};

const DAY_STYLE_FORECAST_FILTERS = new Set(['day', '1day']);

const isDayStyleDailyInterval = (interval: ForecastIntervalConfig) => (
    interval.strategy === 'daily'
    && DAY_STYLE_FORECAST_FILTERS.has(interval.filter)
);

/** Applies the day-style min-temp correction for a single interval. */
const applyTodayCorrections = (
    periods: ForecastPeriod[],
    interval: ForecastIntervalConfig,
    todaySummary: ConditionsSummaryPeriod | null
): ForecastPeriod[] => {
    if (!intervalRequiresMinTempShift(interval) || periods.length === 0) {
        return periods;
    }

    return shiftMinTempValues(
        periods,
        todaySummary,
        intervalUsesSummaryMinTemp(interval)
    );
};

export const intervalRequiresSunMoon = (interval: ForecastIntervalConfig) => (
    interval.includeSunMoon ?? interval.strategy === 'hourly'
);

/** Returns whether this interval needs the day-style min-temp shift. */
export const intervalRequiresMinTempShift = (interval: ForecastIntervalConfig) => (
    isDayStyleDailyInterval(interval)
    && interval.todayDataScope !== undefined
);

/** Returns whether today's minTemp should come from `conditions/summary`. */
export const intervalUsesSummaryMinTemp = (interval: ForecastIntervalConfig) => (
    isDayStyleDailyInterval(interval)
    && interval.todayDataScope === 'start-of-day'
);

export const resolveForecastIntervals = (
    intervals?: ForecastIntervalConfig[]
): ForecastIntervalConfig[] => (
    intervals && intervals.length > 0 ? intervals : DEFAULT_FORECAST_INTERVALS
);

export const resolveIntervalValueMode = (
    interval: ForecastIntervalConfig | null
): ForecastValueMode => {
    if (interval?.valueMode) return interval.valueMode;
    return interval?.strategy === 'daily' ? 'range' : 'single';
};

export const resolveIntervalDateDisplay = (
    interval: ForecastIntervalConfig | null
): ForecastIntervalDateDisplay => {
    if (interval?.dateDisplay) return interval.dateDisplay;
    return interval?.strategy === 'hourly' ? 'time' : 'date';
};

export const resolveIncludeSunMoon = (
    intervals: ForecastIntervalConfig[],
    includeSunMoon?: boolean
) => includeSunMoon ?? intervals.some((interval) => intervalRequiresSunMoon(interval));

export const resolveIncludeConditionsSummary = (intervals: ForecastIntervalConfig[]) => (
    intervals.some((interval) => intervalUsesSummaryMinTemp(interval))
);

const getOptionalForecastResponses = ({
    responseList,
    intervals,
    includeSunMoon,
    includeOutlook
}: {
    responseList: unknown[];
    intervals: ForecastIntervalConfig[];
    includeSunMoon?: boolean;
    includeOutlook: boolean;
}): OptionalForecastResponses => {
    const shouldIncludeSunMoon = resolveIncludeSunMoon(intervals, includeSunMoon);
    const shouldIncludeConditionsSummary = resolveIncludeConditionsSummary(intervals);

    const optionalResponses = responseList.slice(intervals.length);
    let sunMoonResponse: unknown = null;
    let outlookResponse: unknown = null;
    let conditionsSummaryResponse: unknown = null;

    optionalResponses.forEach((responseItem) => {
        if (!sunMoonResponse && shouldIncludeSunMoon && isSunMoonResponse(responseItem)) {
            sunMoonResponse = responseItem;
            return;
        }

        if (!outlookResponse && includeOutlook && isOutlookResponse(responseItem)) {
            outlookResponse = responseItem;
            return;
        }

        if (
            !conditionsSummaryResponse
            && shouldIncludeConditionsSummary
            && isTodaySummaryResponse(responseItem)
        ) {
            conditionsSummaryResponse = responseItem;
        }
    });

    return {
        sunMoonPeriods: sunMoonResponse ? getSunMoonPeriodsFromResponse(sunMoonResponse) : [],
        outlook: includeOutlook && outlookResponse ? getOutlookFromResponse(outlookResponse) : null,
        todaySummary: shouldIncludeConditionsSummary && conditionsSummaryResponse
            ? parseTodaySummaryFromResponse(conditionsSummaryResponse)
            : null
    };
};

/** Builds forecast batch requests in interval-first order. */
export const buildForecastRequests = ({
    coordinatesString,
    intervals,
    paramsByEndpoint,
    includeSunMoon,
    includeOutlook = true
}: BuildForecastRequestsArgs): UseWeatherApiRequest[] => {
    const shouldIncludeSunMoon = resolveIncludeSunMoon(intervals, includeSunMoon);
    const shouldIncludeConditionsSummary = resolveIncludeConditionsSummary(intervals);

    const requests: UseWeatherApiRequest[] = intervals.map((interval) => ({
        endpoint: 'forecasts',
        params: {
            ...interval.params,
            ...paramsByEndpoint?.forecasts,
            filter: interval.filter,
            p: coordinatesString ?? ''
        }
    }));

    if (shouldIncludeSunMoon) {
        requests.push({
            endpoint: 'sunmoon',
            params: {
                from: 'now',
                to: '+1week',
                ...paramsByEndpoint?.sunMoon,
                p: coordinatesString ?? ''
            }
        } as UseWeatherApiRequest);
    }

    if (shouldIncludeConditionsSummary) {
        requests.push({
            endpoint: 'conditions/summary',
            params: {
                fields: CONDITIONS_SUMMARY_MIN_TEMP_FIELDS,
                ...paramsByEndpoint?.conditionsSummary,
                p: coordinatesString ?? ''
            }
        } as UseWeatherApiRequest);
    }

    if (includeOutlook) {
        requests.push({
            endpoint: 'phrases/summary',
            params: {
                ...paramsByEndpoint?.outlook,
                p: coordinatesString ?? ''
            }
        } as UseWeatherApiRequest);
    }

    return requests;
};

export const normalizeForecastBatchResponses = ({
    responses,
    intervals,
    includeSunMoon,
    includeOutlook = true
}: NormalizeForecastBatchResponsesArgs): ForecastNormalizedData => {
    const responseList = Array.isArray(responses) ? responses : [];
    const {
        sunMoonPeriods,
        outlook,
        todaySummary
    } = getOptionalForecastResponses({
        responseList,
        intervals,
        includeSunMoon,
        includeOutlook
    });

    const normalizedIntervals = intervals.reduce<ForecastNormalizedData['intervals']>(
        (acc, interval, intervalIndex) => {
            acc[interval.id] = {
                config: interval,
                periods: applyTodayCorrections(
                    getForecastPeriodsFromResponse(responseList[intervalIndex]),
                    interval,
                    todaySummary
                )
            };
            return acc;
        },
        {}
    );

    return {
        intervals: normalizedIntervals,
        sunMoonPeriods,
        outlook
    };
};
