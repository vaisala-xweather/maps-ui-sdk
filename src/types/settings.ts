import { ColorScaleOptions } from '@xweather/mapsgl';
import { UnitSystem, UnitsByMeasurementType } from './units';

/**
 * Represents the shape of predefined settings managed by the SettingsProvider.
 */
export interface PredefinedSettings {
    /** Current unit system: 'imperial', 'metric', or 'custom' if mixed units. */
    unitSystem: UnitSystem | 'custom';
    /** Units for different measurement types (e.g., temperature, speed). */
    units: UnitsByMeasurementType;
    /** Optional record of color scales keyed by name for data-driven styling. */
    colorScales?: Record<string, ColorScaleOptions>;
}

/**
 * Represents additional custom settings defined by the user.
 * These can be key-value pairs that extend beyond predefined settings.
 */
export interface CustomSettings {
    [key: string]: unknown;
}

/** The combined state includes both predefined and custom settings in a flat structure. */
export type SettingsContextProps = PredefinedSettings & CustomSettings;

/**
 * The shape of initial settings that can be passed into the provider to override defaults
 * or add custom settings.
 */
export type InitialSettings = Omit<Partial<PredefinedSettings>, 'units'> & {
    units?: Partial<UnitsByMeasurementType>;
} & CustomSettings;
