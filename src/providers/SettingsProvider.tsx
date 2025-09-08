import { createContext, useContext, useReducer, ReactNode, Reducer, useCallback } from 'react';
import { styles, ColorScaleOptions } from '@xweather/mapsgl';
import { NormalizedColorScaleName } from '@/types/colors';
import { DEFAULT_UNITS, UNIT_SYSTEM } from '@/constants/units';
import { NORMALIZED_COLOR_SCALES } from '@/constants/colors';
import { getUnitSystemSetting } from '@/utils/units';
import { ValueAction } from '@/types/action/settings';
import { EVENT } from '@/constants/action';
import { settingsStateReducer } from '@/reducers/settingsStateReducer';
import { PredefinedSettings, CustomSettings, InitialSettings } from '@/types/settings';

/** The combined state includes both predefined and custom settings in a flat structure. */
export type SettingsContextProps = PredefinedSettings & CustomSettings;

export interface SettingsProviderProps {
    /** Child components that need access to the settings context. */
    children: ReactNode;
    /** Optional initial settings to override defaults and/or add custom settings. */
    initialSettings?: InitialSettings;
}
/**
 * The value provided by the SettingsContext. It includes:
 * - The entire state of settings (both predefined and custom).
 * - A method to update any setting in the state.
 */
export interface SettingsContextValue extends SettingsContextProps {
    /**
     * Updates a specific setting in the state.
     * Adjusts the unit system if a measurement type changes, ensuring internal consistency.
     *
     * @param id - The key of the setting to update.
     * @param value - The new value for that setting.
     */
    updateSetting: <K extends keyof SettingsContextProps>(
        id: K,
        value: SettingsContextProps[K]
    ) => void;
}

/**
 * Creates the SettingsContext with default values.
 */
export const SettingsContext = createContext<SettingsContextValue>({
    unitSystem: UNIT_SYSTEM.imperial,
    units: DEFAULT_UNITS.imperial,
    colorScales: {},
    updateSetting: () => {
        console.warn('updateSetting called outside of SettingsProvider');
    }
});

/**
 * Hook to consume the SettingsContext. Provides the current settings and the `updateSetting` method.
 * @returns The current settings and update method.
 */
export const useSettingsContext = (): SettingsContextValue => useContext(SettingsContext);

/**
 * Prepares initial settings by merging defaults with any provided initial settings.
 * - Applies default units based on the chosen unit system.
 * - Loads default color scales.
 * - Merges any custom settings or overrides passed in `initialSettings`.
 *
 * @param initialSettings - Optional initial settings to override defaults and/or add custom settings.
 * @returns The merged initial settings.
 */
const prepareInitialSettings = (initialSettings?: InitialSettings): SettingsContextProps => {
    const { unitSystem, units, colorScales, ...customSettings } = initialSettings || {};
    const initialUnits = {
        ...(unitSystem === UNIT_SYSTEM.metric ? DEFAULT_UNITS.metric : DEFAULT_UNITS.imperial),
        ...units
    };

    const defaultColorScales = Object.keys(NORMALIZED_COLOR_SCALES).reduce((acc, key) => {
        const colorScaleName = key as NormalizedColorScaleName;
        acc[colorScaleName] = styles.getColorScale(colorScaleName);
        return acc;
    }, {} as Record<string, ColorScaleOptions>);

    return {
        unitSystem: getUnitSystemSetting(initialUnits),
        units: initialUnits,
        colorScales: {
            ...defaultColorScales,
            ...(colorScales)
        },
        ...customSettings
    };
};

/**
 * The SettingsProvider component.
 *
 * Wrap your application (or a subtree) with this provider to supply settings context
 * (units, color scales, custom settings) to child components. Consumers can read these
 * settings via `useSettingsContext` and update them using `updateSetting`.
 *
 * @example
 * ```tsx
 * <SettingsProvider initialSettings={{ unitSystem: 'metric', units: { temperature: 'C' } }}>
 *   <App />
 * </SettingsProvider>
 * ```
 */
export const SettingsProvider = ({ children, initialSettings }: SettingsProviderProps) => {
    const mergedSettings = prepareInitialSettings(initialSettings);
    const [settings, dispatch] = useReducer<Reducer<SettingsContextProps, ValueAction<SettingsContextProps>>>(
        settingsStateReducer,
        mergedSettings
    );

    /**
         * Updates a specific setting in the state, adds it if it doesn't exist.
         * Adjusts the unit system to 'custom' if it is no longer a valid unit system after this update.
         *
         * @param id - The key of the setting to update.
         * @param value - The new value for that setting.
         *
         * @remarks
         * This function ensures that updates to predefined settings like `unitSystem` and `units` maintain
         * internal consistency. Custom settings are updated directly without additional checks.
         */
    const updateSetting = useCallback(<K extends keyof SettingsContextProps>(
        id: K,
        value: SettingsContextProps[K]
    ) => {
        dispatch({
            type: EVENT.updateValue,
            payload: { id, value }
        });
    }, []);

    const value: SettingsContextValue = {
        ...settings,
        updateSetting
    };

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
