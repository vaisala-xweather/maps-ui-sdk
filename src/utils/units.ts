import { isNil } from '@aerisweather/javascript-utils';
import {
    MeasurementType,
    Unit,
    UnitSystem,
    DefaultUnits,
    UnitsByMeasurementType,
    MeasurementTypeApiMappings,
    MapsGLUnitSymbol,
    MapsGLUnitConversion
} from '@/types/units';
import { isDefaultUnits } from '@/utils/unitTypeGuards';
import {
    UNITS,
    DEFAULT_UNITS,
    UNIT_SYSTEM,
    MEASUREMENT_TYPE,
    MEASUREMENT_TYPE_API_MAPPINGS
} from '@/constants/units';
import { convertToDecimal } from './number';
import { resolveUnitToKey, resolveUnitToSymbol, resolveUnitToConfig } from './unitRegistry';

const {
    temperature,
    speed,
    pressure,
    distance,
    rate,
    precipitation,
    time
} = UNITS;

// -----------------------//
// TEMPERATURE
// -----------------------//
export const FtoC = (f: number) => (f - 32) * (5 / 9);
export const CtoF = (c: number) => (c * 9) / 5 + 32;

// scale conversions
export const CtoFUnit = (c: number) => c * 1.8;
export const FtoCUnit = (f: number) => f * 0.555;

// -----------------------//
// SPEED
//   mph, km/h, m/s, kts
// -----------------------//

// mph ↔ km/h
export const mphToKph = (mph: number) => mph * 1.60934;
export const kphToMph = (kph: number) => kph * 0.621371;

// mph ↔ m/s
export const mphToMs = (mph: number) => mph * 0.44704;
export const msToMph = (ms: number) => ms * 2.23694;

// mph ↔ kts
export const mphToKts = (mph: number) => mph * 0.868976;
export const ktsToMph = (kts: number) => kts * 1.15078;

// km/h ↔ m/s
export const kphToMs = (kph: number) => kph / 3.6;
export const msToKph = (ms: number) => ms * 3.6;

// km/h ↔ kts
export const kphToKts = (kph: number) => kph * 0.539957;
export const ktsToKph = (kts: number) => kts / 0.539957;

// m/s ↔ kts
export const msToKts = (ms: number) => ms * 1.94384;
export const ktsToMs = (kts: number) => kts * 0.514444;

// -----------------------//
// PRESSURE
//   mb, hPa, Pa, inHg
// -----------------------//

// mb ↔ Pa (×100)
export const mbToPa = (mb: number) => mb * 100;
export const paToMb = (pa: number) => pa / 100;

// mb ↔ hPa (1:1)
export const mbToHpa = (mb: number) => mb;
export const hpaToMb = (hpa: number) => hpa;

// Pa ↔ hPa
export const paToHpa = (pa: number) => pa / 100;
export const hpaToPa = (hpa: number) => hpa * 100;

// mb ↔ inHg
export const mbToHg = (mb: number) => mb * 0.02953;
export const hgToMb = (hg: number) => hg / 0.02953;

// -----------------------//
// DISTANCE (or height/depth)
//   m, km, ft, mi
// -----------------------//
export const mToKm = (m: number) => m * 0.001;
export const kmToM = (km: number) => km * 1000;

export const mToFt = (m: number) => m * 3.28084;
export const ftToM = (ft: number) => ft * 0.3048;

export const mToMi = (m: number) => m * 0.000621371;
export const miToM = (mi: number) => mi * 1609.34;

export const kmToMi = (km: number) => km * 0.621371;
export const miToKm = (mi: number) => mi * 1.60934;

export const ftToMi = (ft: number) => ft * 0.000189394;

// -----------------------//
// PRECIPITATION (or snowfall)
//   mm, cm, in, m, ft
// -----------------------//
export const mmToIn = (mm: number) => mm * 0.03937;
export const inToMM = (ins: number) => ins * 25.4;

export const cmToIn = (cm: number) => cm * 0.393701;
export const inToCM = (ins: number) => ins * 2.54;

export const mmToCM = (mm: number) => mm * 0.1;
export const cmToMM = (cm: number) => cm * 10;

export const mToIn = (m: number) => mToFt(m) * 12;
export const inToM = (ins: number) => ins * 0.0254;

export const ftToIn = (ft: number) => ft * 12;
export const inToFt = (ins: number) => ins / 12;

export const mToFtPrecip = (m: number) => m * 3.28084;
export const ftToMPrecip = (ft: number) => ft * 0.3048;

// -----------------------//
// TIME
//   h, min, s, ms
// -----------------------//
export const hToMin = (val: number) => val * 60;
export const minToH = (val: number) => val / 60;

export const hToSec = (val: number) => val * 3600;
export const sToH = (val: number) => val / 3600;

export const hToMs = (val: number) => val * 3600000;
export const msToH = (val: number) => val / 3600000;

export const minToS = (val: number) => val * 60;
export const sToMin = (val: number) => val / 60;

export const minToMs = (val: number) => val * 60000;
export const msToMin = (val: number) => val / 60000;

export const sToMs = (val: number) => val * 1000;
export const msToS = (val: number) => val / 1000;

// -----------------------//
// RATE
//   mm/h, in/h, mm/s, dBZ
// -----------------------//

// 1) mm/h ↔ mm/s
export const mmhToMms = (val: number) => val / 3600;
export const mmsToMmh = (val: number) => val * 3600;

// 2) mm/h ↔ in/h
export const mmhToInh = (val: number) => mmToIn(val);
export const inhToMmh = (val: number) => inToMM(val);

// 3) in/h ↔ mm/s
export const inhToMms = (val: number) => mmhToMms(inToMM(val));
export const mmsToInh = (val: number) => mmToIn(mmsToMmh(val));

// 4) converts a DBZ value to mm/h (or mm/s) precip rate
// https://en.wikipedia.org/wiki/DBZ_%28meteorology%29
export const dbzToMMRate = (dbz: number, perSecond = false): number => {
    // R (mm/h) = (10^(dbz/10) / 200)^(5/8)
    if (dbz <= 0) return 0;
    const baseRate = (10 ** (dbz / 10) / 200) ** (5 / 8);
    return perSecond ? baseRate / 3600 : baseRate;
};

export const mmRateToDbz = (mmRateHr: number): number => {
    // dbz = 10 * log10(200 * (R^(8/5)))
    if (mmRateHr <= 0) return 0;
    return 10 * Math.log10(200 * (mmRateHr ** (8 / 5)));
};

// dBZ ↔ mm/h
export const dbzToMmh = (val: number) => dbzToMMRate(val);
export const mmhToDbz = (val: number) => mmRateToDbz(val);

// dBZ ↔ mm/s
export const dbzToMms = (val: number) => dbzToMMRate(val, true);
export const mmsToDbz = (val: number) => mmRateToDbz(val * 3600);

// dBZ ↔ in/h
export const dbzToInh = (val: number) => mmToIn(dbzToMMRate(val));
export const inhToDbz = (val: number) => mmRateToDbz(inToMM(val));

// -----------------------//
// RATIO, etc.
// -----------------------//
export const percentToDecimal = (percent: number) => percent / 100;
export const decimalToPercent = (decimal: number) => decimal * 100;

export const convert = (
    type: string,
    value: number,
    from: string,
    to: string,
    scaleConversion?: boolean
): number => {
    const resolvedFrom = resolveUnitToSymbol(from);
    const resolvedTo = resolveUnitToSymbol(to);

    switch (type) {
        case 'temperature': {
            if (scaleConversion) {
                // C ↔ Fs
                if (resolvedFrom === temperature.degC && resolvedTo === temperature.degF) return CtoFUnit(value);
                if (resolvedFrom === temperature.degF && resolvedTo === temperature.degC) return FtoCUnit(value);
            } else {
                // C ↔ F
                if (resolvedFrom === temperature.degC && resolvedTo === temperature.degF) return CtoF(value);
                if (resolvedFrom === temperature.degF && resolvedTo === temperature.degC) return FtoC(value);
            }
            break;
        }

        case 'speed': {
            // mph ↔ km/h
            if (resolvedFrom === speed.mph && resolvedTo === speed.kph) return mphToKph(value);
            if (resolvedFrom === speed.kph && resolvedTo === speed.mph) return kphToMph(value);

            // mph ↔ m/s
            if (resolvedFrom === speed.mph && resolvedTo === speed.mps) return mphToMs(value);
            if (resolvedFrom === speed.mps && resolvedTo === speed.mph) return msToMph(value);

            // mph ↔ kts
            if (resolvedFrom === speed.mph && resolvedTo === speed.kts) return mphToKts(value);
            if (resolvedFrom === speed.kts && resolvedTo === speed.mph) return ktsToMph(value);

            // km/h ↔ m/s
            if (resolvedFrom === speed.kph && resolvedTo === speed.mps) return kphToMs(value);
            if (resolvedFrom === speed.mps && resolvedTo === speed.kph) return msToKph(value);

            // km/h ↔ kts
            if (resolvedFrom === speed.kph && resolvedTo === speed.kts) return kphToKts(value);
            if (resolvedFrom === speed.kts && resolvedTo === speed.kph) return ktsToKph(value);

            // m/s ↔ kts
            if (resolvedFrom === speed.mps && resolvedTo === speed.kts) return msToKts(value);
            if (resolvedFrom === speed.kts && resolvedTo === speed.mps) return ktsToMs(value);
            break;
        }

        case 'pressure': {
            // mb ↔ Pa
            if (resolvedFrom === pressure.mb && resolvedTo === pressure.pa) return mbToPa(value);
            if (resolvedFrom === pressure.pa && resolvedTo === pressure.mb) return paToMb(value);

            // mb ↔ hPa
            if (resolvedFrom === pressure.mb && resolvedTo === pressure.hpa) return mbToHpa(value);
            if (resolvedFrom === pressure.hpa && resolvedTo === pressure.mb) return hpaToMb(value);

            // Pa ↔ hPa
            if (resolvedFrom === pressure.pa && resolvedTo === pressure.hpa) return paToHpa(value);
            if (resolvedFrom === pressure.hpa && resolvedTo === pressure.pa) return hpaToPa(value);

            // mb ↔ inHg
            if (resolvedFrom === pressure.mb && resolvedTo === pressure.inhg) return mbToHg(value);
            if (resolvedFrom === pressure.inhg && resolvedTo === pressure.mb) return hgToMb(value);
            break;
        }

        case 'distance':
        case 'height': {
            if (resolvedFrom === distance.m && resolvedTo === distance.km) return mToKm(value);
            if (resolvedFrom === distance.km && resolvedTo === distance.m) return kmToM(value);

            if (resolvedFrom === distance.m && resolvedTo === distance.ft) return mToFt(value);
            if (resolvedFrom === distance.ft && resolvedTo === distance.m) return ftToM(value);

            if (resolvedFrom === distance.m && resolvedTo === distance.mi) return mToMi(value);
            if (resolvedFrom === distance.mi && resolvedTo === distance.m) return miToM(value);

            if (resolvedFrom === distance.km && resolvedTo === distance.mi) return kmToMi(value);
            if (resolvedFrom === distance.mi && resolvedTo === distance.km) return miToKm(value);

            break;
        }

        case 'precipitation':
        case 'snowfall': {
            // mm ↔ in
            if (resolvedFrom === precipitation.mm && resolvedTo === precipitation.in) return mmToIn(value);
            if (resolvedFrom === precipitation.in && resolvedTo === precipitation.mm) return inToMM(value);

            // cm ↔ in
            if (resolvedFrom === precipitation.cm && resolvedTo === precipitation.in) return cmToIn(value);
            if (resolvedFrom === precipitation.in && resolvedTo === precipitation.cm) return inToCM(value);

            // mm ↔ cm
            if (resolvedFrom === precipitation.mm && resolvedTo === precipitation.cm) return mmToCM(value);
            if (resolvedFrom === precipitation.cm && resolvedTo === precipitation.mm) return cmToMM(value);

            // m ↔ in
            if (resolvedFrom === precipitation.m && resolvedTo === precipitation.in) return mToIn(value);
            if (resolvedFrom === precipitation.in && resolvedTo === precipitation.m) return inToM(value);

            // m ↔ cm
            if (resolvedFrom === precipitation.m && resolvedTo === precipitation.cm) return value * 100;
            if (resolvedFrom === precipitation.cm && resolvedTo === precipitation.m) return value / 100;

            break;
        }

        case 'time': {
            // h ↔ min
            if (resolvedFrom === time.h && resolvedTo === time.min) return hToMin(value);
            if (resolvedFrom === time.min && resolvedTo === time.h) return minToH(value);

            // h ↔ s
            if (resolvedFrom === time.h && resolvedTo === time.s) return hToSec(value);
            if (resolvedFrom === time.s && resolvedTo === time.h) return sToH(value);

            // h ↔ ms
            if (resolvedFrom === time.h && resolvedTo === time.ms) return hToMs(value);
            if (resolvedFrom === time.ms && resolvedTo === time.h) return msToH(value);

            // min ↔ s
            if (resolvedFrom === time.min && resolvedTo === time.s) return minToS(value);
            if (resolvedFrom === time.s && resolvedTo === time.min) return sToMin(value);

            // min ↔ ms
            if (resolvedFrom === time.min && resolvedTo === time.ms) return minToMs(value);
            if (resolvedFrom === time.ms && resolvedTo === time.min) return msToMin(value);

            // s ↔ ms
            if (resolvedFrom === time.s && resolvedTo === time.ms) return sToMs(value);
            if (resolvedFrom === time.ms && resolvedTo === time.s) return msToS(value);
            break;
        }

        case 'rate': {
            // mm/h ↔ mm/s
            if (resolvedFrom === rate.mmh && resolvedTo === rate.mms) return mmhToMms(value);
            if (resolvedFrom === rate.mms && resolvedTo === rate.mmh) return mmsToMmh(value);

            // mm/h ↔ in/h
            if (resolvedFrom === rate.mmh && resolvedTo === rate.inh) return mmhToInh(value);
            if (resolvedFrom === rate.inh && resolvedTo === rate.mmh) return inhToMmh(value);

            // in/h ↔ mm/s
            if (resolvedFrom === rate.inh && resolvedTo === rate.mms) return inhToMms(value);
            if (resolvedFrom === rate.mms && resolvedTo === rate.inh) return mmsToInh(value);

            // dBZ ↔ mm/h
            if (resolvedFrom === rate.dbz && resolvedTo === rate.mmh) return dbzToMmh(value);
            if (resolvedFrom === rate.mmh && resolvedTo === rate.dbz) return mmhToDbz(value);

            // dBZ ↔ mm/s
            if (resolvedFrom === rate.dbz && resolvedTo === rate.mms) return dbzToMms(value);
            if (resolvedFrom === rate.mms && resolvedTo === rate.dbz) return mmsToDbz(value);

            // dBZ ↔ in/h
            if (resolvedFrom === rate.dbz && resolvedTo === rate.inh) return dbzToInh(value);
            if (resolvedFrom === rate.inh && resolvedTo === rate.dbz) return inhToDbz(value);
            break;
        }

        default: {
            return value;
        }
    }
    return value;
};

export const degToDir = (d: number): string => {
    if (d < 0) d += 360;
    else if (d > 360) d -= 360;

    const dirs = [
        '↓ N', '↓ NNE', '↙ NE', '← ENE', '← E', '← ESE', '↖ SE', '↑ SSE',
        '↑ S', '↑ SSW', '↗ SW', '→ WSW', '→ W', '→ WNW', '↘ NW', '↓ NNW'
    ];
    const len = dirs.length;
    const index = Math.floor(d / (360 / len));

    return dirs[index % len];
};

/**
 * Gets the MapsGL unit symbol for a given measurement type and unit input
 * @param measurementType - The measurement type to get the unit for
 * @param unitInput - The unit input to resolve
 * @returns The MapsGL unit symbol if found; otherwise, undefined.
 */
export function getMapsGLUnitSymbol<M extends MeasurementType>(
    measurementType: M,
    unitInput: string
): MapsGLUnitSymbol<M> | undefined {
    const unitKey = resolveUnitToKey(unitInput);
    if (!unitKey) return undefined;

    const { units } = MEASUREMENT_TYPE_API_MAPPINGS[measurementType].mapsgl;
    return units[unitKey as keyof typeof units]?.symbol;
}

export const getMeasurementType = (value: string): MeasurementType | null => {
    const entry = Object
        .entries(MEASUREMENT_TYPE_API_MAPPINGS)
        .find(([_, config]) => config.weatherApi.pattern && new RegExp(config.weatherApi.pattern, 'i').test(value));
    return entry ? entry[0] as MeasurementType : null;
};

export function getSuffix<M extends keyof MeasurementTypeApiMappings>(
    measurementType: M,
    unit: Unit
): string | null {
    const weatherApiUnitsConfig = MEASUREMENT_TYPE_API_MAPPINGS[measurementType].weatherApi.units;
    const resolvedKey = resolveUnitToKey(unit);
    if (!resolvedKey) return null;

    if (resolvedKey in weatherApiUnitsConfig) {
        return weatherApiUnitsConfig[resolvedKey as keyof typeof weatherApiUnitsConfig].suffix;
    }
    return null;
}

export const getApiKey = (
    baseKey: string,
    units: Partial<Record<MeasurementType, Unit>>,
    measurementType?: MeasurementType
): string => {
    const internalMeasurementType: MeasurementType | null = measurementType ?? getMeasurementType(baseKey);

    if (!internalMeasurementType) {
        return baseKey;
    }

    const unit = units[internalMeasurementType];
    const suffix = unit ? getSuffix(internalMeasurementType, unit) : null;
    return suffix ? `${baseKey}${suffix}` : baseKey;
};

/**
 * Gets formatted unit text for a value from API data
 * @param units - Map of measurement types to units
 * @param data - The data object containing the value
 * @param apiKeyRoot - The base API key to look for
 * @param measurementType - Optional explicit measurement type
 * @returns Formatted unit text or 'N/A' if value not found
 */
export const getUnitText = (
    units: Partial<Record<MeasurementType, Unit>>,
    data: any,
    apiKeyRoot: string,
    measurementType?: MeasurementType
): string => {
    const apiKey = getApiKey(apiKeyRoot, units, measurementType);
    const value = data?.[apiKey];
    const internalMeasurementType = getMeasurementType(apiKeyRoot);

    if (internalMeasurementType && !isNil(value)) {
        const unit = units[internalMeasurementType];
        if (!unit) {
            return `${value}`;
        }

        return formatUnitText(internalMeasurementType, unit, value);
    }
    return 'N/A';
};

/**
 * Formats a value with the appropriate unit label, and precision
 * @param measurementType - The type of measurement (temperature, speed, etc.)
 * @param unitKey - The unit key to use for formatting
 * @param value - The numeric value to format
 * @param unitPrecisionConfig - Optional configuration for precision overrides
 * @returns Formatted string with value and unit
 * @throws Error if the unit configuration cannot be found
 */

export const formatUnitText = (
    measurementType: MeasurementType,
    unit: Unit,
    value: number | undefined,
    precision?: number
): string => {
    const measurementConfig = UNITS[measurementType];

    const unitConfig = resolveUnitToConfig(unit);

    if (!unitConfig) {
        const validUnits = Object.keys(measurementConfig).join(', ');
        throw new Error(
            `Invalid unit "${String(unit)}" for ${measurementType}. Valid units: ${validUnits}`
        );
    }

    const { format: { precision: defaultPrecision, spacer } } = unitConfig;
    const effectivePrecision = precision ?? defaultPrecision ?? 0;
    const convertedValue = convertToDecimal(value, effectivePrecision);
    const space = spacer ? ' ' : '';

    return `${convertedValue}${space}${unitConfig.symbol ?? ''}`;
};

export const getDefaultUnit = (type: MeasurementType, metric: boolean): string => (
    metric ? DEFAULT_UNITS.metric[type] : DEFAULT_UNITS.imperial[type]
);

export const getUnitSystem = (units: DefaultUnits): null | UnitSystem => {
    if (Object.entries(units).every(([key, value]) => (
        value === DEFAULT_UNITS[UNIT_SYSTEM.imperial][key as keyof DefaultUnits]
    ))) {
        return UNIT_SYSTEM.imperial;
    }
    if (Object.entries(units).every(([key, value]) => (
        value === DEFAULT_UNITS[UNIT_SYSTEM.metric][key as keyof DefaultUnits]
    ))) {
        return UNIT_SYSTEM.metric;
    }
    return null;
};

export const getUnitSystemSetting = (units: UnitsByMeasurementType): UnitSystem | 'custom' => {
    if (!isDefaultUnits(units)) {
        return 'custom';
    }

    return getUnitSystem(units) ?? 'custom';
};

export const isPrecipitationOrSnowfall = (
    measurementType: MeasurementType
): measurementType is (
    Extract<MeasurementType, typeof MEASUREMENT_TYPE.precipitation | typeof MEASUREMENT_TYPE.snowfall>
) => measurementType === MEASUREMENT_TYPE.precipitation || measurementType === MEASUREMENT_TYPE.snowfall;

export const convertUnitsToMapsGLUnits = (
    settingValue: string | number | string[] | number[],
    unitConversion: MapsGLUnitConversion
) => {
    const { measurementType, from, to, scaleConversion } = unitConversion;
    const unitConverter = (value: string | number) => (
        convert(measurementType, Number(value), from, to, scaleConversion)
    );

    if (Array.isArray(settingValue)) {
        return settingValue.map((value) => unitConverter(value));
    }

    return unitConverter(settingValue);
};
