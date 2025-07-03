import { UnitKey, UnitSymbol, UnitInput, MeasurementType, UnitsByMeasurementType } from '@/types/units';
import { UNIT_REGISTRY, UNIT_ALIAS_LOOKUP, UNITS } from '@/constants/units';

/**
 * Resolves a unit string (symbol, alias, or key) to its internal unit key.
 *
 * @param unitString - The unit string to resolve (e.g., '°C', 'km/h', 'degC').
 * @returns The corresponding unit key if found; otherwise, undefined.
 */
export const resolveUnitToKey = (unitString: string): UnitKey | undefined => {
    if (!unitString) return undefined;

    if (unitString in UNIT_REGISTRY) {
        return unitString as UnitKey;
    }

    const unitKey = UNIT_ALIAS_LOOKUP[unitString.toLowerCase()];
    return unitKey ? unitKey as UnitKey : undefined;
};

/**
 * Resolves a unit string to its canonical symbol.
 *
 * @param unitString - The unit string to resolve.
 * @returns The canonical symbol if found; otherwise, undefined.
 */
export const resolveUnitToSymbol = (unitString: string): UnitSymbol | undefined => {
    const unitKey = resolveUnitToKey(unitString);
    return unitKey ? UNIT_REGISTRY[unitKey].symbol : undefined;
};

/**
 * Resolves a unit input (symbol, alias, or key) to its complete unit configuration.
 *
 * @param unitString - A valid unit input.
 * @returns The complete unit configuration if found; otherwise, undefined.
 */
export const resolveUnitToConfig = (unitString: UnitInput) => {
    const unitKey = resolveUnitToKey(unitString);
    return unitKey ? UNIT_REGISTRY[unitKey] : undefined;
};

/**
 * Resolves a measurement type and unit input to the canonical symbol for that measurement.
 *
 * @param measurementType - The measurement type (e.g., 'temperature', 'speed').
 * @param unitInput - The unit input to resolve.
 * @returns The canonical symbol for the unit if found; otherwise, undefined.
 */
export function resolveUnitToSymbolByMeasurement<M extends keyof typeof UNITS>(
    measurementType: M,
    unitInput: string
): UnitsByMeasurementType[M] | undefined {
    const unitKey = resolveUnitToKey(unitInput);
    if (!unitKey) return undefined;

    const measurementUnits = UNITS[measurementType];
    if (!(unitKey in measurementUnits)) return undefined;

    if (!(UNIT_REGISTRY[unitKey].measurementTypes as readonly MeasurementType[]).includes(measurementType)) {
        return undefined;
    }

    const symbol = measurementUnits[unitKey as keyof typeof measurementUnits];

    return symbol as unknown as UnitsByMeasurementType[M];
}
