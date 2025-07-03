import { useMemo } from 'react';
import { useSettingsContext } from '@/providers/SettingsProvider';
import { convert, formatUnitText } from '@/utils/units';
import { ControlUnits } from '@/types/control';
import { MEASUREMENT_TYPE } from '@/constants/units';
import { Unit } from '@/types/units';

/**
 * Hook for converting and formatting numeric values based on unit configuration and unit settings.
 *
 * @remarks
 * This hook handles unit conversion and formatting and is overloaded to support both single values and arrays.
 * It respects the current unit settings from the SettingsContext and supports custom value formatting.
 *
 * @example
 * ```tsx
 * // Single value
 * const displayValue = useUnitDisplay(10, {
 *   scaleConversion: true,
 *   measurementType: 'temperature',
 *   base: 'C'
 * });
 *
 * // Array of values
 * const [rangeMin, rangeMax] = useUnitDisplay([-50, 100], {
 *   measurementType: 'temperature',
 *   base: 'F'
 * });
 * ```
 *
 * @param value - The numeric value(s) to convert and format
 * @param units - Configuration object specifying measurement type, base unit of the value and optional scale conversion
 * @param valueFormatter - Optional custom formatter function
 * @returns Formatted string representation(s) of the value(s)
 */

export function useUnitDisplay(
    value: number,
    units: ControlUnits,
    valueFormatter?: (value: number) => string | null | undefined
): string;

export function useUnitDisplay(
    value: number[],
    units: ControlUnits,
    valueFormatter?: (value: number) => string | null | undefined
): string[];

export function useUnitDisplay(
    value: number | number[],
    units: ControlUnits,
    valueFormatter?: (value: number) => string | null | undefined
): string | string[] {
    const { units: settingsUnits } = useSettingsContext();

    return useMemo(() => {
        const convertAndFormatValue = (rawValue: number): string => {
            const formattedValue = valueFormatter?.(rawValue);
            if (formattedValue != null) return formattedValue;

            const { measurementType, base, scaleConversion = false, precision } = units;
            const settingsUnit = settingsUnits[measurementType];

            if (!base || measurementType === MEASUREMENT_TYPE.ratio) {
                return formatUnitText(measurementType, settingsUnit, rawValue);
            }

            const convertedValue = convert(
                measurementType,
                rawValue,
                base,
                settingsUnit,
                scaleConversion
            );

            const unitPrecisionConfig = precision ?? (
                scaleConversion && settingsUnit !== base && base
                    ? { [settingsUnit]: 1 }
                    : undefined
            );

            return formatUnitText(
                measurementType,
                settingsUnit,
                convertedValue,
                unitPrecisionConfig?.[settingsUnit]
            );
        };

        return Array.isArray(value)
            ? value.map((newValue) => convertAndFormatValue(newValue))
            : convertAndFormatValue(value);
    }, [value, units, valueFormatter, settingsUnits]);
}
