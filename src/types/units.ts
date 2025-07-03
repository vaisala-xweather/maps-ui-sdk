import { units } from '@aerisweather/mapsgl';
import {
    UNIT_SYSTEM,
    DEFAULT_UNITS,
    UNITS,
    UNIT_REGISTRY
} from '@/constants/units';

const { Units: MapsGLUnits } = units;

/**
 * Type for a measurement type (e.g. temperature, speed, pressure, etc.)
 */
export type MeasurementType = keyof typeof UNITS;

/**
 * Represents any valid unit input string, including unit symbols and their aliases.
 * For example: '°C', 'degC', 'C' are all valid inputs for Celsius temperature.
 */
export type UnitInput = string;

/**
 * Maps each unit key to an array of its valid representations.
 * The array always contains:
 * 1. The canonical symbol (e.g., '°C')
 * 2. The unit key (e.g., 'degC')
 * 3. Any additional aliases (e.g., 'C')
 */
export type UnitAliasesByUnitKey = {
    [K in keyof typeof UNIT_REGISTRY]: [
        (typeof UNIT_REGISTRY)[K]['symbol'],
        K,
        ...(typeof UNIT_REGISTRY)[K]['aliases']
    ]
};

/**
 * Represents the canonical symbol for a unit (e.g., '°C', 'km/h', '%').
 * These are the standardized display formats for units in the UI.
 */
export type UnitSymbol = (typeof UNIT_REGISTRY)[keyof typeof UNIT_REGISTRY]['symbol'];

/**
 * Alias for UnitSymbol, representing a canonical unit representation.
 */
export type Unit = UnitSymbol;

/**
 * Represents the internal keys used to reference units in the registry (e.g. 'degC', 'kph', 'mb').
 * Used for consistent internal unit identification and lookups.
 */
export type UnitKey = keyof typeof UNIT_REGISTRY;

/**
 * Maps measurement types to their valid unit symbols.
 * Ensures type safety when assigning units to measurement types.
 */
export type UnitsByMeasurementType = {
    [K in keyof typeof UNITS]:
    typeof UNITS[K][keyof typeof UNITS[K]]
};

/**
 * Represents the available unit systems (metric or imperial).
 * Used for global unit preferences and conversions.
 */
export type UnitSystem = (typeof UNIT_SYSTEM)[keyof typeof UNIT_SYSTEM];

/**
 * Represents the complete set of default units for a given unit system.
 * Maps measurement types to their default units based on the system (metric/imperial).
 */
export type DefaultUnits = typeof DEFAULT_UNITS[UnitSystem];

/**
 * Configuration for unit-specific precision overrides.
 * Allows customizing the number of decimal places shown for specific units.
 */
export type UnitPrecisionConfig = Partial<Record<Unit, number>>;

/* ------------------------------------------------------------------------------------------------------------------ */
// MapsGL and Weather API mapping types

export type MapsGLUnitConversionTarget =
    | typeof UNITS.temperature.degC
    | typeof UNITS.speed.mps
    | typeof UNITS.pressure.mb
    | typeof UNITS.distance.m
    | typeof UNITS.precipitation.mm
    | typeof UNITS.rate.dbz
    | typeof UNITS.rate.mms
    | typeof UNITS.concentration.ugm3;

export interface MapsGLUnitConversion {
    scaleConversion?: boolean;
    measurementType: MeasurementType;
    from: Unit;
    to: MapsGLUnitConversionTarget;
}

/**
 * Configuration for a Weather API unit, specifying how a unit is represented in API requests.
 * @property suffix - Optional suffix appended to API keys (e.g., 'C' for Celsius, null if no suffix needed)
 */
interface WeatherApiUnitConfig {
  suffix: string | null;
}

/**
 * Weather API configuration for a specific measurement type.
 *
 * @typeParam M - Measurement type key from the UNITS constant
 * @property pattern - Optional regex pattern to identify this measurement type in API keys
 * @property units - Mapping of unit keys to their API-specific configurations
 */
interface WeatherApiMeasurementTypeConfig<M extends keyof typeof UNITS> {
  pattern: string | null;
  units: {
    [K in keyof (typeof UNITS)[M]]: WeatherApiUnitConfig;
  };
}

/**
 * Derives the allowed MapsGL unit symbol for a given measurement type.
 *
 * This type computes a union of literal types (e.g. "C" | "F" for temperature)
 * from the external MapsGL Units constant based on the measurement category.
 *
 * @typeParam M - The measurement type key (e.g. 'temperature', 'speed').
 */
export type MapsGLUnitSymbol<M extends keyof any> =
  M extends 'temperature' ? typeof MapsGLUnits.temperature[keyof typeof MapsGLUnits.temperature] :
  M extends 'speed' ? typeof MapsGLUnits.speed[keyof typeof MapsGLUnits.speed] :
  M extends 'pressure' ? typeof MapsGLUnits.pressure[keyof typeof MapsGLUnits.pressure] :
  M extends 'height' ? typeof MapsGLUnits.distance[keyof typeof MapsGLUnits.distance] :
  M extends 'distance' ? typeof MapsGLUnits.distance[keyof typeof MapsGLUnits.distance] :
  M extends 'precipitation' ? typeof MapsGLUnits.precipitation[keyof typeof MapsGLUnits.precipitation] :
  M extends 'snowfall' ? typeof MapsGLUnits.precipitation[keyof typeof MapsGLUnits.precipitation] :
  M extends 'direction' ? typeof MapsGLUnits.direction[keyof typeof MapsGLUnits.direction] :
  M extends 'time' ? typeof MapsGLUnits.time[keyof typeof MapsGLUnits.time] :
  M extends 'rate' ? typeof MapsGLUnits.rate[keyof typeof MapsGLUnits.rate] :
  M extends 'concentration' ? typeof MapsGLUnits.concentration[keyof typeof MapsGLUnits.concentration] :
  M extends 'ratio' ? typeof MapsGLUnits.ratio[keyof typeof MapsGLUnits.ratio] :
  never;

/**
 * Configuration for MapsGL integration for a given measurement type.
 *
 * @typeParam M - The measurement type key from the UNITS constant.
 * @property unitConversionTarget - The maps-ui-sdk unit that should be converted
 * to when passing units to MapsGL for the given measurement type.
 * @property units - A map of unit keys to their corresponding MapsGL unit symbols.
 */
interface MapsGLMeasurementTypeConfig<M extends keyof typeof UNITS> {
  unitConversionTarget?: MapsGLUnitConversionTarget;
  units: {
    [K in keyof (typeof UNITS)[M]]: { symbol: MapsGLUnitSymbol<M> };
  };
}

/**
 * Represents the API mapping entry for a single measurement type.
 *
 * This defines how a specific measurement type (e.g., temperature, speed) is handled across both the
 * Weather API and MapsGL, including unit conversions and symbol mappings.
 *
 * @typeParam M - The measurement type key from the `UNITS` constant.
 */
interface MeasurementTypeApiMappingEntry<M extends keyof typeof UNITS> {
  weatherApi: WeatherApiMeasurementTypeConfig<M>;
  mapsgl: MapsGLMeasurementTypeConfig<M>;
}

/**
 * Complete API mappings organized by measurement type.
 *
 * Maps each measurement type to its API-specific configurations, including:
 * - Weather API property patterns and unit suffixes
 * - MapsGL unit conversion settings
 *
 * This mapping is used to:
 * 1. Identify measurement types in API property names
 * 2. Apply appropriate unit suffixes to API requests
 * 3. Convert between internal units and MapsGL units
 *
 */
export type MeasurementTypeApiMappings = {
  [M in keyof typeof UNITS]: MeasurementTypeApiMappingEntry<M>;
};
