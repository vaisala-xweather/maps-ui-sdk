import { units } from '@aerisweather/mapsgl';
import { UnitKey, UnitAliasesByUnitKey, MeasurementTypeApiMappings } from '@/types/units';

const { Units: MapsGLUnits } = units;

/**
 * Available unit systems for measurement conversion.
 */
export const UNIT_SYSTEM = {
    imperial: 'imperial',
    metric: 'metric'
} as const;

/**
 * Supported measurement types for unit conversions.
 */
export const MEASUREMENT_TYPE = {
    temperature: 'temperature',
    speed: 'speed',
    pressure: 'pressure',
    height: 'height',
    distance: 'distance',
    precipitation: 'precipitation',
    snowfall: 'snowfall',
    direction: 'direction',
    time: 'time',
    rate: 'rate',
    concentration: 'concentration',
    ratio: 'ratio'
} as const;

/** Array of all supported measurement types for iteration */
export const MEASUREMENT_TYPES = Object.values(MEASUREMENT_TYPE);

/**
 * Unit registry containing detailed configuration for each supported unit.
 * It is the source of truth for all units and their configurations.
 *
 * Each unit entry contains:
 * @property symbol - The canonical display symbol for the unit
 * @property aliases - Array of alternative string representations
 * @property format - Display formatting configuration
 *   - precision: Number of decimal places to show
 *   - spacer: Whether to add space between value and unit
 * @property measurementTypes - Array of measurement types this unit can be used for
 */
export const UNIT_REGISTRY = {
    // Temperature
    degC: {
        symbol: '°C',
        aliases: ['degC', 'C'],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.temperature]
    },
    degF: {
        symbol: '°F',
        aliases: ['degF', 'F'],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.temperature]
    },

    // Speed
    mps: {
        symbol: 'm/s',
        aliases: ['mps'],
        format: { precision: 1, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.speed]
    },
    kph: {
        symbol: 'km/h',
        aliases: ['kph', 'kph', 'km/hr'],
        format: { precision: 1, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.speed]
    },
    mph: {
        symbol: 'mph',
        aliases: ['mi/h', 'MPH'],
        format: { precision: 2, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.speed]
    },
    kts: {
        symbol: 'kts',
        aliases: ['kt', 'knots', 'kn'],
        format: { precision: 2, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.speed]
    },

    // Pressure
    pa: {
        symbol: 'Pa',
        aliases: ['pa'],
        format: { precision: 0, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.pressure]
    },
    hpa: {
        symbol: 'hPa',
        aliases: ['hpa'],
        format: { precision: 0, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.pressure]
    },
    mb: {
        symbol: 'mb',
        aliases: [],
        format: { precision: 0, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.pressure]
    },
    inhg: {
        symbol: 'inHg',
        aliases: ['inhg', 'hg'],
        format: { precision: 2, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.pressure]
    },

    // Distance/Height
    m: {
        symbol: 'm',
        aliases: [],
        format: { precision: 0, spacer: true },
        measurementTypes: [
            MEASUREMENT_TYPE.distance,
            MEASUREMENT_TYPE.height,
            MEASUREMENT_TYPE.precipitation,
            MEASUREMENT_TYPE.snowfall
        ]
    },
    km: {
        symbol: 'km',
        aliases: [],
        format: { precision: 2, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.distance]
    },
    ft: {
        symbol: 'ft',
        aliases: [],
        format: { precision: 0, spacer: true },
        measurementTypes: [
            MEASUREMENT_TYPE.distance,
            MEASUREMENT_TYPE.height,
            MEASUREMENT_TYPE.precipitation,
            MEASUREMENT_TYPE.snowfall
        ]
    },
    mi: {
        symbol: 'mi',
        aliases: [],
        format: { precision: 2, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.distance]
    },

    // Precipitation/Snowfall
    mm: {
        symbol: 'mm',
        aliases: [],
        format: { precision: 1, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.precipitation, MEASUREMENT_TYPE.snowfall]
    },
    cm: {
        symbol: 'cm',
        aliases: [],
        format: { precision: 1, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.precipitation, MEASUREMENT_TYPE.snowfall]
    },
    in: {
        symbol: 'in',
        aliases: [],
        format: { precision: 2, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.precipitation, MEASUREMENT_TYPE.snowfall]
    },

    // Direction
    deg: {
        symbol: '°',
        aliases: ['deg'],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.direction]
    },

    // Time
    h: {
        symbol: 'h',
        aliases: ['hr'],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.time]
    },
    min: {
        symbol: 'min',
        aliases: [],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.time]
    },
    s: {
        symbol: 's',
        aliases: ['sec'],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.time]
    },
    ms: {
        symbol: 'ms',
        aliases: [],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.time]
    },
    mmh: {
        symbol: 'mm/h',
        aliases: ['mmh', 'mmhr', 'mm/hr'],
        format: { precision: 1, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.rate]
    },
    inh: {
        symbol: 'in/h',
        aliases: ['inh', 'inhr', 'in/hr'],
        format: { precision: 2, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.rate]
    },
    mms: {
        symbol: 'mm/s',
        aliases: ['mms', 'mmps'],
        format: { precision: 1, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.rate]
    },
    dbz: {
        symbol: 'dBZ',
        aliases: ['dbz', 'DBZ'],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.rate]
    },

    // Concentration
    ppm: {
        symbol: 'ppm',
        aliases: [],
        format: { precision: 0, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.concentration]
    },
    ugm3: {
        symbol: 'μg/m³',
        aliases: ['ugm3', 'ug/m3', 'ug/m^3'],
        format: { precision: 1, spacer: true },
        measurementTypes: [MEASUREMENT_TYPE.concentration]
    },

    // Ratio
    percent: {
        symbol: '%',
        aliases: ['percent', 'pct'],
        format: { precision: 0, spacer: false },
        measurementTypes: [MEASUREMENT_TYPE.ratio]
    }
} as const;

/**
 * Mapping of measurement types to their supported units.
 * Provides quick access to valid units for each measurement type.
 */
export const UNITS = {
    temperature: {
        degC: UNIT_REGISTRY.degC.symbol,
        degF: UNIT_REGISTRY.degF.symbol
    },
    speed: {
        mps: UNIT_REGISTRY.mps.symbol,
        kph: UNIT_REGISTRY.kph.symbol,
        mph: UNIT_REGISTRY.mph.symbol,
        kts: UNIT_REGISTRY.kts.symbol
    },
    pressure: {
        pa: UNIT_REGISTRY.pa.symbol,
        hpa: UNIT_REGISTRY.hpa.symbol,
        mb: UNIT_REGISTRY.mb.symbol,
        inhg: UNIT_REGISTRY.inhg.symbol
    },
    distance: {
        m: UNIT_REGISTRY.m.symbol,
        km: UNIT_REGISTRY.km.symbol,
        ft: UNIT_REGISTRY.ft.symbol,
        mi: UNIT_REGISTRY.mi.symbol
    },
    height: {
        m: UNIT_REGISTRY.m.symbol,
        ft: UNIT_REGISTRY.ft.symbol
    },
    precipitation: {
        mm: UNIT_REGISTRY.mm.symbol,
        cm: UNIT_REGISTRY.cm.symbol,
        in: UNIT_REGISTRY.in.symbol,
        m: UNIT_REGISTRY.m.symbol,
        ft: UNIT_REGISTRY.ft.symbol
    },
    snowfall: {
        mm: UNIT_REGISTRY.mm.symbol,
        cm: UNIT_REGISTRY.cm.symbol,
        in: UNIT_REGISTRY.in.symbol,
        m: UNIT_REGISTRY.m.symbol,
        ft: UNIT_REGISTRY.ft.symbol
    },
    direction: {
        deg: UNIT_REGISTRY.deg.symbol
    },
    time: {
        h: UNIT_REGISTRY.h.symbol,
        min: UNIT_REGISTRY.min.symbol,
        s: UNIT_REGISTRY.s.symbol,
        ms: UNIT_REGISTRY.ms.symbol
    },
    rate: {
        mmh: UNIT_REGISTRY.mmh.symbol,
        inh: UNIT_REGISTRY.inh.symbol,
        mms: UNIT_REGISTRY.mms.symbol,
        dbz: UNIT_REGISTRY.dbz.symbol
    },
    concentration: {
        ppm: UNIT_REGISTRY.ppm.symbol,
        ugm3: UNIT_REGISTRY.ugm3.symbol
    },
    ratio: {
        percent: UNIT_REGISTRY.percent.symbol
    }
} as const;

export const UNIT_SYMBOLS = Object.fromEntries(
    Object.entries(UNIT_REGISTRY).map(([key, config]) => [key, config.symbol])
) as { [K in keyof typeof UNIT_REGISTRY]: (typeof UNIT_REGISTRY)[K]['symbol'] };

export const UNIT_KEY = Object.fromEntries(
    Object.entries(UNIT_REGISTRY).map(([key]) => [key, key])
) as { [K in keyof typeof UNIT_REGISTRY]: K };

export const UNIT_ALIASES = Object.fromEntries(
    Object.entries(UNIT_REGISTRY).map(([key, config]) => [
        key,
        [config.symbol, key, ...config.aliases]
    ])
) as UnitAliasesByUnitKey;

/**
 * Lookup map for unit aliases to their corresponding unit keys.
 * Provides fast resolution of unit aliases to their canonical unit keys.
 */
export const UNIT_ALIAS_LOOKUP = Object.entries(UNIT_ALIASES).reduce<Record<string, UnitKey>>((map, [key, aliases]) => {
    aliases.forEach((alias) => {
        map[alias.toLowerCase()] = key as UnitKey;
    });
    return map;
}, {});

const {
    temperature,
    speed,
    pressure,
    distance,
    height,
    precipitation,
    snowfall,
    direction,
    time,
    rate,
    concentration,
    ratio
} = UNITS;

/**
 * Default unit configurations for metric and imperial systems.
 * Specifies the standard unit to use for each measurement type based on the chosen system and measurement type.
 */
export const DEFAULT_UNITS = {
    imperial: {
        temperature: temperature.degF,
        speed: speed.mph,
        pressure: pressure.inhg,
        distance: distance.mi,
        height: height.ft,
        precipitation: precipitation.in,
        snowfall: snowfall.in,
        direction: direction.deg,
        time: time.h,
        rate: rate.inh,
        concentration: concentration.ppm,
        ratio: ratio.percent
    },
    metric: {
        temperature: temperature.degC,
        speed: speed.kph,
        pressure: pressure.mb,
        distance: distance.km,
        height: height.m,
        precipitation: precipitation.mm,
        snowfall: snowfall.cm,
        direction: direction.deg,
        time: time.h,
        rate: rate.mmh,
        concentration: concentration.ugm3,
        ratio: ratio.percent
    }
} as const;

/**
 * Defines API mappings across measurement types for different systems.
 *
 * This mapping specifies how units are handled in both the Weather API and MapsGL
 * contexts, including symbol conversions and suffix usage for API requests.
 *
 * Each entry in this type maps a measurement type (e.g., 'temperature', 'speed')
 * to its corresponding API mapping entry, which provides settings for both systems.
 *
 */
export const MEASUREMENT_TYPE_API_MAPPINGS: MeasurementTypeApiMappings = {
    temperature: {
        weatherApi: {
            pattern: '(temp|dewpoint|dewpt|feelslike|windchill|heatindex)',
            units: {
                degC: { suffix: 'C' },
                degF: { suffix: 'F' }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.temperature.degC,
            units: {
                degC: { symbol: MapsGLUnits.temperature.C },
                degF: { symbol: MapsGLUnits.temperature.F }
            }
        }
    },
    speed: {
        weatherApi: {
            pattern: '(speed|gust|wind)',
            units: {
                mps: { suffix: 'MPS' },
                kph: { suffix: 'KPH' },
                mph: { suffix: 'MPH' },
                kts: { suffix: 'KTS' }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.speed.mps,
            units: {
                mps: { symbol: MapsGLUnits.speed.ms },
                kph: { symbol: MapsGLUnits.speed.kmh },
                mph: { symbol: MapsGLUnits.speed.mph },
                kts: { symbol: MapsGLUnits.speed.kts }
            }
        }
    },
    pressure: {
        weatherApi: {
            pattern: '(pressure|altimeter)',
            units: {
                mb: { suffix: 'MB' },
                pa: { suffix: 'MB' },
                hpa: { suffix: 'MB' },
                inhg: { suffix: 'IN' }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.pressure.mb,
            units: {
                mb: { symbol: MapsGLUnits.pressure.mb },
                pa: { symbol: MapsGLUnits.pressure.pa },
                hpa: { symbol: MapsGLUnits.pressure.hPa },
                inhg: { symbol: MapsGLUnits.pressure.hg }
            }
        }
    },
    height: {
        weatherApi: {
            pattern: '(ceiling|elev|elevation|height|ht)',
            units: {
                m: { suffix: 'M' },
                ft: { suffix: 'FT' }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.height.m,
            units: {
                m: { symbol: MapsGLUnits.distance.m },
                ft: { symbol: MapsGLUnits.distance.ft }
            }
        }
    },
    distance: {
        weatherApi: {
            pattern: '(visibility|distance)',
            units: {
                m: { suffix: 'M' },
                km: { suffix: 'KM' },
                ft: { suffix: 'FT' },
                mi: { suffix: 'MI' }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.distance.m,
            units: {
                m: { symbol: MapsGLUnits.distance.m },
                km: { symbol: MapsGLUnits.distance.km },
                ft: { symbol: MapsGLUnits.distance.ft },
                mi: { symbol: MapsGLUnits.distance.mi }
            }
        }
    },
    precipitation: {
        weatherApi: {
            pattern: '(precip|rain|prcp)',
            units: {
                mm: { suffix: 'MM' },
                cm: { suffix: 'CM' },
                in: { suffix: 'IN' },
                m: { suffix: 'M' },
                ft: { suffix: 'FT' }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.precipitation.mm,
            units: {
                mm: { symbol: MapsGLUnits.precipitation.mm },
                cm: { symbol: MapsGLUnits.precipitation.cm },
                in: { symbol: MapsGLUnits.precipitation.in },
                m: { symbol: MapsGLUnits.precipitation.m },
                ft: { symbol: MapsGLUnits.precipitation.ft }
            }
        }
    },
    snowfall: {
        weatherApi: {
            pattern: '(snow|snowdepth|hail)',
            units: {
                mm: { suffix: 'MM' },
                cm: { suffix: 'CM' },
                in: { suffix: 'IN' },
                m: { suffix: 'M' },
                ft: { suffix: 'FT' }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.precipitation.mm,
            units: {
                mm: { symbol: MapsGLUnits.precipitation.mm },
                cm: { symbol: MapsGLUnits.precipitation.cm },
                in: { symbol: MapsGLUnits.precipitation.in },
                m: { symbol: MapsGLUnits.precipitation.m },
                ft: { symbol: MapsGLUnits.precipitation.ft }
            }
        }
    },
    direction: {
        weatherApi: {
            pattern: null,
            units: {
                deg: { suffix: 'DEG' }
            }
        },
        mapsgl: {
            units: {
                deg: { symbol: MapsGLUnits.direction.deg }
            }
        }
    },
    time: {
        weatherApi: {
            pattern: null,
            units: {
                h: { suffix: 'HR' },
                min: { suffix: 'MIN' },
                s: { suffix: 'SEC' },
                ms: { suffix: 'MS' }
            }
        },
        mapsgl: {
            units: {
                h: { symbol: MapsGLUnits.time.hr },
                min: { symbol: MapsGLUnits.time.min },
                s: { symbol: MapsGLUnits.time.sec },
                ms: { symbol: MapsGLUnits.time.ms }
            }
        }
    },
    rate: {
        weatherApi: {
            pattern: null,
            units: {
                mmh: { suffix: 'MM' },
                inh: { suffix: 'IN' },
                mms: { suffix: null },
                dbz: { suffix: null }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.rate.mms,
            units: {
                mmh: { symbol: MapsGLUnits.rate.mmhr },
                inh: { symbol: MapsGLUnits.rate.inhr },
                mms: { symbol: MapsGLUnits.rate.mms },
                dbz: { symbol: MapsGLUnits.rate.dbz }
            }
        }
    },
    concentration: {
        weatherApi: {
            pattern: null,
            units: {
                ppm: { suffix: null },
                ugm3: { suffix: null }
            }
        },
        mapsgl: {
            unitConversionTarget: UNITS.concentration.ugm3,
            units: {
                ppm: { symbol: MapsGLUnits.concentration.ppm },
                ugm3: { symbol: MapsGLUnits.concentration.ugm3 }
            }
        }
    },
    ratio: {
        weatherApi: {
            pattern: '(rh|humid|pop|prob|sky|skycover)',
            units: {
                percent: { suffix: null }
            }
        },
        mapsgl: {
            units: {
                percent: { symbol: MapsGLUnits.ratio.percent }
            }
        }
    }
} as const;
