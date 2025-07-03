import {
    UNIT_SYSTEM, MEASUREMENT_TYPES,
    MEASUREMENT_TYPE,
    UNITS,
    DEFAULT_UNITS
} from '@/constants/units';
import {
    Unit,
    UnitSystem,
    UnitsByMeasurementType,
    DefaultUnits,
    MeasurementType
} from '@/types/units';

/* ------------------------------------------------------------------------------------------------------------------ */

/**
 * Type guard to check if a value is a valid UnitSystem.
 * @param value - The value to check.
 * @returns True if the value is a UnitSystem, false otherwise.
 */
export const isUnitSystem = (value: unknown): value is UnitSystem => (
    value === UNIT_SYSTEM.metric || value === UNIT_SYSTEM.imperial
);

/**
 * Type guard to check if a value is a measurement type.
 * @param value - The value to check.
 * @returns True if value is a MeasurementType, false otherwise.
 */
export const isMeasurementType = (value: unknown): value is MeasurementType => (
    typeof value === 'string' && value in MEASUREMENT_TYPE
);

/**
 * Type guard to validate if an object conforms to UnitsByMeasurementType.
 * @param value - The value to validate.
 * @returns True if the value is a valid UnitsByMeasurementType, false otherwise.
 */
export const isValidUnitsObject = (value: unknown): value is UnitsByMeasurementType => {
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    // Ensure all measurement types are present
    const hasAllMeasurementTypes = MEASUREMENT_TYPES.every((type) => type in value);
    if (!hasAllMeasurementTypes) {
        return false;
    }

    // Check each measurement type has a valid unit
    return Object.entries(value).every(([type, unit]) => isValidUnitForMeasurementType(type, unit));
};

/**
 * Type guard to validate if an object conforms to DefaultUnits
 */
export const isDefaultUnits = (value: unknown): value is DefaultUnits => {
    if (!isValidUnitsObject(value)) {
        return false;
    }

    // Additional check for specific properties required by DefaultUnits
    return Object.keys(DEFAULT_UNITS).every((key) => key in value);
};

/**
 * Type guard to ensure a given value is a valid unit for a specific measurement type.
 * @param measurementType - The measurement type to validate against.
 * @param unitValue - The unit value to validate.
 * @returns True if the unit is valid for the specified measurement type, false otherwise.
 */
export const isValidUnitForMeasurementType = (
    key: unknown,
    value: unknown
): key is MeasurementType => {
    if (!isMeasurementType(key as string)) {
        return false;
    }

    if (typeof value !== 'string') {
        return false;
    }

    const measurementType = key as MeasurementType;
    const validUnits = measurementType in UNITS
        ? Object.values(UNITS[measurementType]).map((unit) => unit)
        : [];
    const isValid = validUnits.includes(value as Unit);

    if (!isValid) {
        console.warn(
            `Invalid unit "${value}" for measurement type "${measurementType}". `
            + `Valid units are: ${validUnits.join(', ')}`
        );
    }

    return isValid;
};
